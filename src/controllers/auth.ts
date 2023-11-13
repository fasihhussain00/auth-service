import { NextFunction, Response } from "express";
import { AzureADSSOAuth } from "../auth/azuread";
import { GoogleSSOAuth } from "../auth/google";
import { AppAuthRequest } from "../middleware/types";
import { Auth } from "../orm/entities/auth";
import {
  AppleAuthConfig,
  AuthType,
  AzureADAuthConfig,
  GoogleAuthConfig,
  SendGridConfig,
} from "../orm/entities/types";
import { authRepo, userRepo } from "../orm/repo";
import { AppleSSOAuth } from "../auth/apple";
import { allowedDomain, getHosts } from "../utils/uri";
import JwtAuth from "../auth/jwt";
import SendGrid from "../notification/sendgrid";
import { getUserAgentInfo } from "../utils/useragent";
import { getFDate, getFTime } from "../utils/date";
import appConfig from "../configs/app";

enum MagicLinkType {
  LOGIN = "login",
  SIGNUP = "signup",
}

export const authRegister = async (req: AppAuthRequest, res: Response) => {
  const auth = authRepo.create(req.body as Auth);
  auth.app = req.clientApp;
  const savedAuth = await authRepo.save(auth);
  res.status(201).json(savedAuth);
};

export const login = async (
  req: AppAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user = await userRepo.findOne({ where: { email: email } });
  if (!user || !user.passwordMatch(password)) {
    return res.status(401).send("Invalid email or password");
  }
  req.user = user;
  next();
};
export const google = async (req: AppAuthRequest, res: Response) => {
  const { callbackUri, failureUri } = req.query as any;
  const googleAuth = await authRepo.findOne({
    where: { type: AuthType.GOOGLE, app: { id: req.clientApp.id } },
  });
  if (!googleAuth) {
    return res.status(400).send("Google auth not configured for this app");
  }
  const googleSSO = new GoogleSSOAuth(googleAuth.config as GoogleAuthConfig);
  const state = Buffer.from(
    JSON.stringify({ callbackUri, failureUri, appId: req.clientApp.id })
  ).toString("base64");
  const redirectUri = await googleSSO.getLoginUrl(state, failureUri as string);
  if (!redirectUri) {
    return res
      .status(400)
      .send("Google auth not configured correctly for this app");
  }
  res.redirect(redirectUri);
};
export const googleCallback = async (
  req: AppAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { state, code } = req.query as any;
  const parsedState = JSON.parse(Buffer.from(state, "base64").toString());
  try {
    const googleAuth = await authRepo.findOne({
      where: { type: AuthType.GOOGLE, app: { id: parsedState.appId } },
      relations: ["app"],
    });
    const googleSSO = new GoogleSSOAuth(googleAuth.config as GoogleAuthConfig);
    const token = await googleSSO.getToken(code);
    const { sub, name, email } = await googleSSO.getUserInfo(token.id_token);
    let user = await userRepo.findOne({ where: { email } });
    if (!user) {
      user = await userRepo.save({
        email,
        name,
        sourceId: sub,
        app: googleAuth.app,
      });
    }
    req.clientApp = googleAuth.app;
    user.app = undefined;
    req.user = user;
    req["redirectUri"] = parsedState.callbackUri;
    next();
  } catch (error) {
    res.redirect(parsedState.failureUri);
  }
};

export const azureAd = async (req: AppAuthRequest, res: Response) => {
  const { callbackUri, failureUri } = req.query as any;
  const azureADAuth = await authRepo.findOne({
    where: { type: AuthType.AZUREAD, app: { id: req.clientApp.id } },
  });
  if (!azureADAuth) {
    return res.status(400).send("Azure AD auth not configured for this app");
  }
  const azureADSSO = new AzureADSSOAuth(
    azureADAuth.config as AzureADAuthConfig
  );
  const state = Buffer.from(
    JSON.stringify({ callbackUri, failureUri, appId: req.clientApp.id })
  ).toString("base64");
  const redirectUri = await azureADSSO.getLoginUrl(state, failureUri as string);
  if (!redirectUri) {
    return res
      .status(400)
      .send("Azure AD auth not configured correctly for this app");
  }
  res.redirect(redirectUri);
};

export const azureADCallback = async (
  req: AppAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { state, code } = req.query as any;
  const parsedState = JSON.parse(Buffer.from(state, "base64").toString());
  try {
    const azureADAuth = await authRepo.findOne({
      where: { type: AuthType.AZUREAD, app: { id: parsedState.appId } },
      relations: ["app"],
    });
    const azureADSSO = new AzureADSSOAuth(
      azureADAuth.config as AzureADAuthConfig
    );
    const token = await azureADSSO.getToken(code);
    const { name, email, id } = await azureADSSO.getUserInfo(token);
    let user = await userRepo.findOne({ where: { email } });
    if (!user) {
      user = await userRepo.save({
        email,
        name,
        sourceId: id,
        app: azureADAuth.app,
      });
    }
    req.clientApp = azureADAuth.app;
    user.app = undefined;
    req.user = user;
    req["redirectUri"] = parsedState.callbackUri;
    next();
  } catch (error) {
    console.log(error)
    res.redirect(parsedState.failureUri);
  }
};

export const apple = async (req: AppAuthRequest, res: Response) => {
  const { callbackUri, failureUri } = req.query as any;
  const appleAuth = await authRepo.findOne({
    where: { type: AuthType.APPLE, app: { id: req.clientApp.id } },
  });
  if (!appleAuth) {
    return res.status(400).send("Apple auth not configured for this app");
  }
  const appleSSO = new AppleSSOAuth(
    appleAuth.config as AppleAuthConfig
  );
  const state = Buffer.from(
    JSON.stringify({ callbackUri, failureUri, appId: req.clientApp.id })
  ).toString("base64");
  const redirectUri = appleSSO.getLoginUrl(state);
  if (!redirectUri) {
    return res
      .status(400)
      .send("Apple auth not configured correctly for this app");
  }
  res.redirect(redirectUri);
};

export const appleCallback = async (
  req: AppAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { state, code } = req.query as any;
  const parsedState = JSON.parse(Buffer.from(state, "base64").toString());
  try {
    const appleAuth = await authRepo.findOne({
      where: { type: AuthType.APPLE, app: { id: parsedState.appId } },
      relations: ["app"],
    });
    const appleSSO = new AppleSSOAuth(
      appleAuth.config as AppleAuthConfig
    );
    const token = await appleSSO.getToken(code);
    const { name, email, id } = await appleSSO.getUserInfo(token);
    let user = await userRepo.findOne({ where: { email } });
    if (!user) {
      user = await userRepo.save({
        email,
        name,
        sourceId: id,
        app: appleAuth.app,
      });
    }
    req.clientApp = appleAuth.app;
    user.app = undefined;
    req.user = user;
    req["redirectUri"] = parsedState.callbackUri;
    next();
  } catch (error) {
    res.redirect(parsedState.failureUri);
  }
};

export const magicLink = async (req: AppAuthRequest, res: Response) => {
  const { email, signUpUri, loginPageUri, failureUri } = req.body;
  const [signUpUriDomain, loginPageUriDomain, failureUriDomain] = getHosts([
    signUpUri,
    loginPageUri,
    failureUri,
  ]);
  if (req.clientApp.allowedHosts?.length) {
    if (
      !allowedDomain(
        [signUpUriDomain, loginPageUriDomain, failureUriDomain].filter(
          (x) => x
        ),
        req.clientApp.allowedHosts
      )
    ) {
      return res
        .status(400)
        .send({ message: "Given uris or uri domains are not allowed" });
    }
  }
  if (!req.clientApp.allowedEmailHosts.includes(email.split("@").at(-1))) {
    return res
      .status(400)
      .send({ message: "Given email domain is not allowed" });
  }
  const user = await userRepo.findOne({
    where: { email, app: { id: req.clientApp.id } },
  });
  const magicLinkType = !user ? MagicLinkType.SIGNUP : MagicLinkType.LOGIN;
  const magicLinkTemplate =
    magicLinkType == MagicLinkType.SIGNUP
      ? req.clientApp.signUpMagicLinkTemplate
      : req.clientApp.loginMagicLinkTemplate;
  const magicLinkUri =
    magicLinkType == MagicLinkType.SIGNUP ? signUpUri : loginPageUri;
  const magicLinkToken = JwtAuth.signWithAppKey(
    {
      email,
      uri: magicLinkUri,
      magicLinkType: magicLinkType,
      appId: req.clientApp.key,
    },
    "1h"
  );
  if (
    magicLinkType == MagicLinkType.SIGNUP &&
    (!signUpUri || !req.clientApp.signUpMagicLinkTemplate)
  ) {
    return res.status(404).send({ message: "User not found" });
  }

  if (!req.clientApp.notificationConfig) {
    return res.status(400).send("Notification config not found");
  }

  const { browser, os } = getUserAgentInfo(req.headers["user-agent"] as string);
  const [fdate, ftime] = [getFDate(), getFTime()];
  const success = await new SendGrid(
    req.clientApp.notificationConfig as SendGridConfig
  ).sendEmail(email, magicLinkTemplate, {
    link: `${appConfig.baseUrl}/api/magic-link/verify?token=${magicLinkToken}&appId=${req.clientApp.key}`,
    browser,
    os,
    fdate,
    ftime,
  });
  return res.send({ success });
};

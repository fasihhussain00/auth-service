import { Setting } from "../entities/setting";
import { AppDataSource } from "../ormconfig";
import {
  xeroClientIdKey,
  xeroClientSecretKey,
  xeroTenantIdKey,
  xeroTokenSetKey,
} from "../../consts";
export class SettingSeeder {
  public static async seed(): Promise<void> {
    const settingRepo = AppDataSource.getRepository(Setting);
    const settingsToSeed: any[] = [];

    for (const setting of settingsToSeed) {
      try {
        await settingRepo.save(setting);
      } catch (error) {
        console.log(error);
        continue;
      }
    }
  }
}

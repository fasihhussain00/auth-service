import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Account } from "./account";
import { NotificationConfig, NotificationType } from "./types";
import { Auth } from "./auth";

@Entity()
export class App {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "app_pk" })
  id: number;

  @Column()
  name: string;

  @Column({
    name: "account_id",
  })
  accountId: number;

  @ManyToOne(() => Account)
  @JoinColumn({
    name: "account_id",
    foreignKeyConstraintName: "account_app_fk",
  })
  account: Account;

  @Column()
  key: string;

  @Column()
  secret: string;

  @Column({
    type: "text",
    array: true,
  })
  corsOrigins: string[];

  @Column({
    type: "text",
    array: true,
    default: [],
  })
  allowedHosts: string[];

  @Column({
    type: "text",
    array: true,
    default: [],
  })
  allowedEmailHosts: string[];

  @Column({
    nullable: true,
  })
  magicLinkTemplate?: string;

  @Column({
    nullable: true,
  })
  resetPasswordTemplate?: string;

  @Column({ nullable: true })
  notificationType?: NotificationType;

  @Column({ type: "json", nullable: true })
  notificationConfig?: NotificationConfig;

  @Column("json", { nullable: true })
  metadata?: any;

  @OneToMany(() => Auth, (auth) => auth.app, { cascade: true })
  auths: Auth[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

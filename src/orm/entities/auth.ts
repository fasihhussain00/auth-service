import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  Entity,
  Index,
} from "typeorm";
import { AuthConfig, AuthType } from "./types";
import { App } from "./app";

@Index("app_auth_uk", ["app", "type"], {
  unique: true,
  where: "(deleted_at IS NULL)",
})
@Entity()
export class Auth {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "auth_pk" })
  id: number;

  @Column({
    name: "app_id",
  })
  appId: number;

  @ManyToOne(() => App)
  @JoinColumn({
    name: "app_id",
    foreignKeyConstraintName: "app_auth_fk",
  })
  app: App;

  @Column()
  type: AuthType;

  @Column({ type: "json" })
  config: AuthConfig;

  @Column("json", { nullable: true })
  metadata?: any;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  @DeleteDateColumn()
  deleted_at: Date;
}

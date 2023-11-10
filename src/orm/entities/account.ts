import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  BeforeUpdate,
  BeforeInsert,
} from "typeorm";
import { App } from "./app";
import { generateHash, validateHash } from "../../hashing";

@Entity()
export class Account {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "account_pk" })
  id: number;

  @Column({
    nullable: true,
  })
  name?: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column("json", { nullable: true })
  metadata?: any;

  @OneToMany(() => App, (app) => app.account, { cascade: true })
  apps: App[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @BeforeUpdate()
  @BeforeInsert()
  hashPassword() {
    if (this.password) this.password = generateHash(this.password);
  }

  passwordMatch(unencryptedPassword: string) {
    return validateHash(unencryptedPassword, this.password);
  }
  toJSON(): Partial<Account> {
    this.password = undefined;
    return this;
  }
}

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
  BeforeUpdate,
  BeforeInsert,
} from "typeorm";
import { App } from "./app";
import { generateHash, validateHash } from "../../hashing";

@Index("app_user_uk", ["app", "email"], {
  unique: true,
  where: "(deleted_at IS NULL)",
})
@Entity()
export class User {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "user_pk" })
  id: number;

  @ManyToOne(() => App)
  @JoinColumn({ name: "app_id", foreignKeyConstraintName: "app_user_fk" })
  app: App;

  @Column({ name: "app_id" })
  appId: number;

  @Column({ nullable: true })
  sourceId: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  issuedToken: string;

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

  @BeforeUpdate()
  @BeforeInsert()
  hashPassword() {
    if (this.password) this.password = generateHash(this.password);
  }

  passwordMatch(unencryptedPassword: string) {
    if(!unencryptedPassword || !this.password) return false;
    return validateHash(unencryptedPassword, this.password);
  }
  toJSON(): Partial<User> {
    this.password = undefined;
    return this;
  }
}

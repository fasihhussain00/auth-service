import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
} from "typeorm";

@Entity()
export class Token {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "token_pk" })
  id: number;

  @Column()
  token: string;

  @Column({ default: false })
  used: boolean;

  @Column()
  @CreateDateColumn()
  created_at: Date;
}

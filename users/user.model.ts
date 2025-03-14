import { Sequelize, DataTypes, Model, Optional } from "sequelize";


export interface UserAttributes {
  id?: number;
  email: string;
  passwordHash: string;
  title: string;
  firstName: string;
  lastName: string;
  role: string;
}


export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

// Define the User model class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public title!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: string;

  public async destroy(): Promise<void> {
    await super.destroy();
  }
}


export default function model(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ["passwordHash"] },
      },
      scopes: {
        withHash: {
          attributes: { include: ["passwordHash"] },
        },
      },
    }
  );

  return User;
}

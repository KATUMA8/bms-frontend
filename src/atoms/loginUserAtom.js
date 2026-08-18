import { atom } from "jotai";

// テスト用にここで初期値を切り替える

//　管理者でテストしたい場合：
// const initialUser = {
//   userId: 1,
//   name: "管理者",
//   roleFlag: 1, // ← ここを 1 にすれば管理者、2 にすれば発注業者として全ページが連動します
//   companyId: null,
// };

// 発注業者でテストしたい場合：

const initialUser = {
  userId: 2,
  name: "鈴木一郎（発注業者）",
  roleFlag: 2,
  companyId: 1,
};


export const loginUserAtom = atom(initialUser);
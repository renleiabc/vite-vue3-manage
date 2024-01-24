import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import http from './http';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}
export async function login(data: LoginData) {
  const res = await http.post('/api/user/login', data);
  return res;
}

export async function logout() {
  const res = http.post('/api/user/logout');
  return res;
}

export async function getUserInfo() {
  const res = (await http.post('/api/user/info')) as any as UserState;
  return res;
}

export function getMenuList() {
  const res = http.post('/api/user/menu') as any as RouteRecordNormalized;
  return res;
}

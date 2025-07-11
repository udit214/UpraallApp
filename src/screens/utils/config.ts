// utils/config.ts
import { Platform } from 'react-native';

export const BASE_URL =
  Platform.OS === 'ios'
    ? 'http://192.168.188.164:8000' // iOS: use localhost for simulator
    : 'http://10.0.2.2:8000'; // Android emulator: 10.0.2.2 to access host machine

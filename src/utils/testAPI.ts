// src/utils/testAPI.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../api/config';

/**
 * 사용자 정보 API 테스트
 * 여러 엔드포인트를 시도해서 어느 것이 작동하는지 확인
 */
export const testUserAPI = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  
  console.log('');
  console.log('=========================');
  console.log('🧪 API TEST');
  console.log('=========================');
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('Token exists:', !!token);
  
  if (!token) {
    console.log('❌ No token found. Please login first.');
    console.log('=========================');
    console.log('');
    return;
  }
  
  // 테스트할 엔드포인트 목록
  const endpoints = [
    '/user',
    '/me',
    '/profile',
    '/users/me',
    '/api/user',
    '/api/me',
  ];
  
  console.log('\nTesting endpoints...\n');
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing: ${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ SUCCESS!');
        console.log('   Data:', JSON.stringify(data, null, 2));
        console.log(`   👉 Use this endpoint: ${endpoint}`);
      } else {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.log(`   ❌ Failed: ${error.detail || error.message}`);
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('=========================');
  console.log('');
};

/**
 * 특정 API 엔드포인트 테스트
 */
export const testAPI = async (endpoint: string, method: string = 'GET', body?: any) => {
  const token = await AsyncStorage.getItem('accessToken');
  
  console.log('');
  console.log('=========================');
  console.log(`🧪 TEST: ${method} ${endpoint}`);
  console.log('=========================');
  
  if (!token) {
    console.log('❌ No token found');
    console.log('=========================');
    console.log('');
    return;
  }
  
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
      console.log('Body:', body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS');
      console.log('Data:', JSON.stringify(data, null, 2));
    } else {
      const error = await response.json().catch(() => ({}));
      console.log('❌ FAILED');
      console.log('Error:', JSON.stringify(error, null, 2));
    }
  } catch (error: any) {
    console.log('❌ EXCEPTION');
    console.log('Error:', error.message);
  }
  
  console.log('=========================');
  console.log('');
};

/**
 * 상점 API 전체 테스트
 */
export const testShopAPI = async () => {
  console.log('');
  console.log('=========================');
  console.log('🛍️ SHOP API TEST');
  console.log('=========================');
  
  // 1. 구매 테스트
  console.log('\n1️⃣ Test Purchase');
  await testAPI('/shop/purchase', 'POST', { item_number: 1 });
  
  // 2. 장착 테스트
  console.log('\n2️⃣ Test Equip');
  await testAPI('/shop/equip', 'POST', { item_number: 1 });
  
  // 3. 해제 테스트
  console.log('\n3️⃣ Test Unequip');
  await testAPI('/shop/equip', 'DELETE');
  
  console.log('=========================');
  console.log('');
};

/**
 * 챌린지 API 테스트
 */
export const testChallengeAPI = async () => {
  console.log('');
  console.log('=========================');
  console.log('🎯 CHALLENGE API TEST');
  console.log('=========================');
  
  await testAPI('/challenges/daily', 'GET');
  
  console.log('=========================');
  console.log('');
};
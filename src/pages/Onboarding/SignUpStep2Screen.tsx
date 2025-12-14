import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import ScaledText from '../../components/ScaledText';

function userPoolSignUp(
  name: string,
  phone: string,
  gender: string,
  birthDate: string,
  password: string,
  poolData: { UserPoolId: string; ClientId: string }
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const userPool = new CognitoUserPool(poolData);

    // 생년월일을 YYYY-MM-DD 형식으로 변환
    const formattedBirthDate = `${birthDate.slice(0, 4)}-${birthDate.slice(4, 6)}-${birthDate.slice(6, 8)}`;

    const attributeList = [
      new CognitoUserAttribute({ Name: 'phone_number', Value: phone }),
      new CognitoUserAttribute({ Name: 'name', Value: name }),
      new CognitoUserAttribute({ Name: 'gender', Value: gender }),
      new CognitoUserAttribute({ Name: 'birthdate', Value: formattedBirthDate }),
    ];

    console.log('📝 Cognito 회원가입 요청');
    console.log('   - Username (전화번호):', phone);
    console.log('   - 이름:', name);
    console.log('   - 성별:', gender);
    console.log('   - 생년월일:', formattedBirthDate);

    userPool.signUp(
      phone, // username
      password, // password
      attributeList, // attributes
      [], // validationData
      (err, result) => {
        if (err) {
          console.error('❌ Cognito 회원가입 실패:', err);
          return reject(err);
        } else {
          console.log('✅ Cognito 회원가입 성공:', result);
          resolve(true);
        }
      }
    );
  });
}

export default function SignUpStep2Screen({ route, navigation }: any) {
  const { name, gender, birthDate, phone, poolData } = route.params || {};

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    // 비밀번호 유효성 검사
    if (!password || !passwordConfirm) {
      Alert.alert('오류', '비밀번호를 입력해주세요');
      return;
    }

    if (password.length < 8) {
      Alert.alert('오류', '비밀번호는 최소 8자리 이상이어야 합니다');
      return;
    }

    // 비밀번호 강도 검사 (Cognito 요구사항)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      Alert.alert(
        '오류',
        '비밀번호는 대문자, 소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해야 합니다'
      );
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다');
      return;
    }

    // Cognito 회원가입 요청 및 인증번호 발송
    setLoading(true);
    try {
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚀 Step 2: Cognito 회원가입');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      await userPoolSignUp(name, '+82' + phone.substring(1), gender, birthDate, password, poolData);

      console.log('✅ 인증번호 발송 완료');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');

      Alert.alert('성공', '인증번호가 전송되었습니다.\n전화번호를 확인해주세요.', [
        {
          text: '확인',
          onPress: () =>
            navigation.navigate('SignUpStep3', {
              name,
              gender,
              birthDate,
              phone,
              password,
              poolData,
            }),
        },
      ]);
    } catch (error: any) {
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ Cognito 회원가입 에러');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('에러 코드:', error.code);
      console.error('에러 메시지:', error.message);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('');

      // Cognito 에러 메시지 처리
      if (error.code === 'UsernameExistsException') {
        Alert.alert('오류', '이미 등록된 전화번호입니다');
      } else if (error.code === 'InvalidParameterException') {
        Alert.alert('오류', '입력 정보를 확인해주세요');
      } else if (error.code === 'InvalidPasswordException') {
        Alert.alert('오류', '비밀번호 형식이 올바르지 않습니다');
      } else {
        Alert.alert('오류', error.message || '회원가입 요청에 실패했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container1}>
      <ScaledText fontSize={24} style={s.title}>비밀번호를{'\n'}설정해주세요</ScaledText>

      <ScaledText fontSize={14} style={s.passwordGuide}>
        • 8자리 이상{'\n'}
        • 대문자, 소문자, 숫자, 특수문자 포함
      </ScaledText>

      <TextInput
        style={s.input}
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={s.input}
        placeholder="비밀번호를 다시 입력하세요"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
        autoCapitalize="none"
        editable={!loading}
      />

      <TouchableOpacity style={s.button} onPress={handleNext} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ScaledText fontSize={18} style={s.buttonText}>인증번호 받기</ScaledText>
        )}
      </TouchableOpacity>
    </View>
  );
}
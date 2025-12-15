import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { onboardingStyles as s } from '../../styles/Template';
import ScaledText from '../../components/ScaledText';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={s.container1}>
      <ScaledText fontSize={28} style={s.title}>할머니, 할아버지{'\n'}안녕하세요!</ScaledText>

      <Image
        source={require('../../../assets/images/손주전신1.png')}
        style={s.welcomeImage}
        resizeMode="contain"
      />

      <View style={s.container2}>
        <TouchableOpacity style={s.smallButton} onPress={() => navigation.navigate('Login')}>
          <ScaledText fontSize={18} style={s.buttonText}>로그인</ScaledText>
        </TouchableOpacity>
        <TouchableOpacity style={s.smallButton} onPress={() => navigation.navigate('SignUpStep1')}>
          <ScaledText fontSize={18} style={s.buttonText}>회원가입</ScaledText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
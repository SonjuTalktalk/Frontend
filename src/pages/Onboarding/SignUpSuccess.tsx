import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import {styles} from '../../styles/Onboarding';
import {onboardingStyles} from '../../styles/Template';
import ScaledText from '../../components/ScaledText';

export default function SignUpSuccess({ navigation }: any) {
      return (
        <View style={styles.container}>
            <ScaledText fontSize={28} style={styles.title}>이제부터{'\n'}손주와 함께{'\n'}즐거운 AI 공부를{'\n'}해봐요!</ScaledText>
             <Image
                      source={require('../../../assets/images/sonjusmile.png')}
                      style={styles.sonju}
                      resizeMode="contain"
                    />
            <TouchableOpacity
                    style={onboardingStyles.smallButton}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    onPress={() => navigation.navigate('FontSizeSelector')}
            >
                    <ScaledText fontSize={18} style={onboardingStyles.buttonText}>다음으로</ScaledText>
          </TouchableOpacity>
        </View>
      );
}


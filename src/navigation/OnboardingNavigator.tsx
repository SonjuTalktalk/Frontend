import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../pages/Onboarding/WelcomeScreen';
import SignUpStep1Screen from '../pages/Onboarding/SignUpStep1Screen';
import SignUpStep2Screen from '../pages/Onboarding/SignUpStep2Screen';
import SignUpStep3Screen from '../pages/Onboarding/SignUpStep3Screen';
import LoginScreen from '../pages/Onboarding/LoginScreen';
import SignUpSuccess from '../pages/Onboarding/SignUpSuccess';
import FontSizeSelector from '../pages/Onboarding/FontSizeSelector';
import SetSonjuNameStep1 from '../pages/Onboarding/SetSonjuNameStep1';
import SetSonjuNameStep2 from '../pages/Onboarding/SetSonjuNameStep2';
import CharacterSetting from '../pages/Onboarding/CharacterSetting';
import NotificationPermission from '../pages/Onboarding/NotificationPermission';

const Stack = createNativeStackNavigator();

function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignUpStep1" component={SignUpStep1Screen} />
      <Stack.Screen name="SignUpStep2" component={SignUpStep2Screen} />
      <Stack.Screen name="SignUpStep3" component={SignUpStep3Screen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUpSuccess" component={SignUpSuccess} />
      <Stack.Screen name="FontSizeSelector" component={FontSizeSelector} />
      <Stack.Screen name="SetSonjuNameStep1" component={SetSonjuNameStep1} />
      <Stack.Screen name="SetSonjuNameStep2" component={SetSonjuNameStep2} />
      <Stack.Screen name="CharacterSetting" component={CharacterSetting} />
      <Stack.Screen name="NotificationPermission" component={NotificationPermission} />
    </Stack.Navigator>
  );
}

export default OnboardingNavigator;

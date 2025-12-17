// src/pages/HealthPage/PrescriptionOCR.tsx최종본
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator, Alert, Platform, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ScaledText from '../../components/ScaledText';
import { healthStyles } from '../../styles/Health';
import { scanMedicineByOCR } from '../../api/medicineApi';


type OCRStep = 'camera' | 'processing';

export default function PrescriptionOCR() {
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState<OCRStep>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // ✅ 카메라 권한 요청 함수
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: '카메라 권한 요청',
            message: '처방전 촬영을 위해 카메라 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '거부',
            buttonPositive: '허용',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      '이미지 선택',
      '처방전 이미지를 선택해주세요',
      [
        { text: '취소', style: 'cancel' },
        { text: '사진 촬영', onPress: () => handleCapture('camera') },
        { text: '갤러리에서 선택', onPress: () => handleCapture('gallery') },
      ],
      { cancelable: true }
    );
  };

  const handleCapture = async (type: 'camera' | 'gallery') => {
    try {
      console.log(`${type === 'camera' ? '카메라' : '갤러리'} 선택`);

      // ✅ 카메라 사용 시 권한 체크
      if (type === 'camera') {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
          Alert.alert('권한 필요', '카메라 권한이 필요합니다.\n설정에서 권한을 허용해주세요.');
          return;
        }
      }

      let result;

      if (type === 'camera') {
        result = await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 2000,
          maxHeight: 2000,
          saveToPhotos: false,
        });
      } else {
        result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 2000,
          maxHeight: 2000,
          presentationStyle: 'fullScreen',
        });
      }

      if (result.didCancel) {
        console.log('사용자가 취소함');
        return;
      }

      if (result.errorCode) {
        console.error('이미지 선택 에러:', result.errorMessage);

        if (result.errorCode === 'camera_unavailable') {
          Alert.alert('오류', '카메라를 사용할 수 없습니다.');
        } else if (result.errorCode === 'permission') {
          Alert.alert('권한 필요', '카메라/갤러리 접근 권한이 필요합니다.');
        } else {
          Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
        }
        return;
      }

      const asset = result.assets?.[0];
      if (!asset || !asset.uri) {
        console.error('선택된 이미지가 없습니다.');
        Alert.alert('오류', '이미지를 불러올 수 없습니다.');
        return;
      }

      console.log('선택된 이미지:', asset.uri);

      setCapturedImage(asset.uri);
      setCurrentStep('processing');

      const imageFile = {
        uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `prescription_${Date.now()}.jpg`,
      };

      await processOCR(imageFile);

    } catch (err: any) {
      console.error('이미지 처리 실패:', err);
      Alert.alert('오류', '이미지 처리 중 오류가 발생했습니다.');
      setCurrentStep('camera');
      setCapturedImage(null);
    }
  };

  const processOCR = async (imageFile: any) => {
    try {
      console.log('📤 OCR API 호출 중...');

      const medicines = await scanMedicineByOCR(imageFile);
      console.log('✅ OCR 결과:', medicines);

      if (!medicines || medicines.length === 0) {
        throw new Error('인식된 약이 없습니다.');
      }

      const ocrResults = medicines.map((item, index) => ({
        id: String(index + 1),
        name: item.medicine_name,
        frequency: String(item.medicine_daily),
        days: String(item.medicine_period),
        startDate: item.medicine_start_date.replace(/-/g, '/'),
      }));

      console.log('📋 변환된 결과:', ocrResults);

      // 바로 확인 화면으로 이동
      navigation.replace('MedicationResultConfirm', {
        ocrResults: ocrResults,
        isFromOCR: true
      });

    } catch (error: any) {
      console.error('❌ OCR 처리 실패:', error);

      let errorMessage = '처방전 인식에 실패했습니다.';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('인식 실패', errorMessage);
      setCurrentStep('camera');
      setCapturedImage(null);
    }
  };

  return (
    <View style={healthStyles.container}>
      <View style={healthStyles.header}>
        <TouchableOpacity
          style={healthStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../../assets/images/leftarrow.png')}
            style={healthStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <ScaledText fontSize={24} style={healthStyles.headerTitle}>
          복약 알림 설정
        </ScaledText>
      </View>

      <View style={healthStyles.ocrContainer}>
        {currentStep === 'camera' && (
          <View style={healthStyles.cameraView}>
            <ScaledText fontSize={26} style={healthStyles.instructionText}>
              버튼을 눌러 인식할 처방전을{'\n'}촬영하거나 선택해주세요.
            </ScaledText>
            <TouchableOpacity
              style={healthStyles.cameraButton}
              onPress={showImagePickerOptions}
            >
              <Image
                source={require('../../../assets/images/camera.png')}
                style={healthStyles.cameraIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 'processing' && (
          <View style={healthStyles.processingView}>
            <ScaledText fontSize={24} style={healthStyles.instructionText}>
              처방전을 인식하는 중...
            </ScaledText>
            <ActivityIndicator size="large" color="#02BFDC" style={{ marginTop: 40 }} />
          </View>
        )}
      </View>
    </View>
  );
}
import { StyleSheet } from 'react-native';

export const onboardingStyles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 20,
    },

    secondaryButton: {
      width: '100%',
      height: 50,
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#02BFDC',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },

    secondaryButtonText: {
      color: '#02BFDC',
      fontSize: 16,
      fontFamily: 'Pretendard-Medium',
    },
  
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,  // 200 → 20으로 변경
    paddingHorizontal: 20,
    position: 'absolute',  // 추가
    bottom: 100,
  },

  container3: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 20,  // 200 → 20으로 변경
      paddingHorizontal: 20,
      position: 'absolute',  // 추가
      bottom: 270,
    },

    signUpButton: {
      backgroundColor: '#ffffff',   // 회원가입 버튼 배경
      borderWidth: 1,
      borderColor: '#02BFDC',
    },

    signUpButtonText: {
      color: '#02BFDC',             // 회원가입 텍스트 색
      fontWeight: '600',
    },

  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',  // 가운데 정렬 추가
  },

  subtitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 24,
    color: '#777',
    marginTop: 10,
  },

  maintext: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 20,
    color: '#777',
    marginTop: 10,
    textAlign: 'left',
    marginBottom: 15,
  },

  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#02BFDC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
  },

   buttonText2: {
      color: '#777',
      fontSize: 18,
      fontFamily: 'Pretendard-Bold',
   },


  smallButton: {
  width: 150,
  height: 50,
  backgroundColor: '#02BFDC',  // 피그마의 02BFDC
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 10,
  // 그림자 효과 추가 (외곽선 색상 BFE8E2)
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 3,  // Android 그림자
},

 smallButton2: {
  width: 150,
  height: 50,
  backgroundColor: '#fff',  // 피그마의 02BFDC
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 10,
  // 그림자 효과 추가 (외곽선 색상 BFE8E2)
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 15,
  elevation: 3,  // Android 그림자
  borderWidth: 1,
  borderColor: '#F0F0F0',
},

scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // 성별 선택
  genderContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#02BFDC',
    borderColor: '#02BFDC',
  },
  genderText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#333',
  },
  genderTextActive: {
    color: '#fff',
  },

  // 비밀번호 가이드
  passwordGuide: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
    alignSelf: 'flex-start',
    width: '100%',
  },

  // 재발송 버튼
  resendButton: {
    marginTop: 16,
  },
  resendButtonText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#02BFDC',
    textDecorationLine: 'underline',
  },


  welcomeImage: {
  width: 200,
  height: 250,
  marginVertical: 40,
},
});
// src/styles/Health.ts
import { StyleSheet } from 'react-native';

export const healthStyles = StyleSheet.create({
  // 공통 컨테이너
  container: {
    flex: 1,
    backgroundColor: '#B8E9F5',
  },

  // 배경 이미지
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: 900,
    top: 0,
    left: 0,
  },
  backgroundImage2: {
    position: 'absolute',
    width: '120%',
    height: 450,
    top: 485,
    left: 0,
  },

  // 공통 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
  },
  headerTitleCenter: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },

  // 스크롤 컨텐츠
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // HealthPage - 히어로 섹션
  heroSection: {
    position: 'relative',
    width: '100%',
    height: 250,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospitalImage: {
    position: 'absolute',
    top: 120,
    width: '100%',
    height: 220,
  },
  medicationButtonContainer: {
    position: 'absolute',
    top: -20,
    right: 20,
    zIndex: 5,
  },
  medicationButtonImage: {
    width: 100,
    height: 100,
  },
  characterImage: {
    position: 'absolute',
    bottom: 0,
    width: 137,
    height: 234,
  },

  // HealthPage - 복약 알림 카드
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reminderTextContainer: {
    flex: 1,
  },
  reminderTime: {
    fontFamily: 'Pretendard-Medium',
    color: '#02BFDC',
    marginBottom: 8,
  },
  reminderDescription: {
    fontFamily: 'Pretendard-Regular',
    color: '#333',
    lineHeight: 26,
  },

  // HealthPage - 달력 카드
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarHeader: {
    marginBottom: 20,
  },
  calendarMonthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthArrowButton: {
    padding: 8,
  },
  calendarTitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
    fontSize: 20,
  },
  calendarActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 4,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },

  // 요일 헤더
  weekdayHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    width: '14.28%', // 100% / 7
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekdayText: {
    fontFamily: 'Pretendard-Medium',
    color: '#666',
  },

  // 달력 그리드
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%', // 100% / 7 = exactly 7 columns
    height: '14.28%',
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    marginBottom: 8,
  },
  calendarDayText: {
    fontFamily: 'Pretendard-Medium',
    color: '#999',
  },
  statusGood: {
    backgroundColor: '#B8E9F5',
  },
  statusModerate: {
    backgroundColor: '#FFE5B4',
  },
  statusConcerning: {
    backgroundColor: '#FFB4B4',
  },
  todayBorder: {
    borderWidth: 2.5,
    borderColor: '#1A6AA3',
  },
  disabledDay: {
    backgroundColor: '#E8E8E8',
    opacity: 0.5,
  },

  // MedicationSettings - 날짜 카드
  dateCard: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateArrow: {
    padding: 8,
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  dateText: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
  },

  // MedicationSettings - 메인 컨테이너
  medicationContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // MedicationSettings - 시간대 카드
  timeSlotCard: {
    backgroundColor: '#F8F9FA',
    borderWidth: 0.5,
    borderColor: '#02BFDC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#02BFDC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  timeSlotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeSlotTime: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
  },
  editButton: {
    fontFamily: 'Pretendard-Medium',
    color: '#02BFDC',
  },
  medicationList: {
    gap: 12,
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicationName: {
    fontFamily: 'Pretendard-Regular',
    color: '#333',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#fff',
    borderColor: '#D0D0D0',
  },
  checkIcon: {
    width: 38,
    height: 38,
  },
  checkboxContainer: {
    padding: 4,
  },

  // 플로팅 메뉴
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  floatingMenu: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    zIndex: 1000,
    gap:10,
  },
  menuButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    backgroundColor: '#02BFDC',
    borderRadius: 15,
  },
  menuButtonText: {
    fontFamily: 'Pretendard-Medium',
    color: '#fff',
    textAlign: 'center',
  },

  // OCR 화면
  ocrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraView: {
    alignItems: 'center',
  },
  processingView: {
    alignItems: 'center',
  },
  resultView: {
    alignItems: 'center',
  },
  instructionText: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 30,
  },
  cameraButton: {
  },
  cameraIcon: {
    width: 160,
    height: 160,
  },
  confirmButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#02BFDC',
    borderRadius: 12,
  },
  confirmButtonText: {
    fontFamily: 'Pretendard-Medium',
    color: '#fff',
  },

  // 서브 헤더
  subHeaderTitle: {
    fontFamily: 'Pretendard-Regular',
    color: '#666',
    marginLeft: 8,
  },

  // 결과 확인 화면
  resultConfirmContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
    marginBottom: 20,
  },
  medicationResultCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#02BFDC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,

  },
  medicationNameHeader: {
    backgroundColor: '#D9D9D9',
    padding: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 12,
  },
  medicationResultName: {
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
  },
  medicationDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  detailLabel: {
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    minWidth: 40,
    alignItems: 'center',
  },
  detailValueText: {
    fontFamily: 'Pretendard-Regular',
    color: '#000000',
  },
  completeButton: {
    backgroundColor: '#02BFDC',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  completeButtonText: {
    fontFamily: 'Pretendard-Medium',
    color: '#fff',
  },

  // 직접 입력 화면
  manualEntryContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputCard: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#333',
  },

  // HealthDiaryEntry - 컨텐츠
  content: {
    flex: 1,
    padding: 20,
  },
  entryCard: {
    backgroundColor: '#E8F8FC',
    borderRadius: 16,
    padding: 20,
    flex: 1,
  },
  dateTitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: '#333',
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontFamily: 'Pretendard-Medium',
    color: '#02BFDC',
  },

  // HealthDiaryList - 월 카드
  monthCard: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 10,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthArrow: {
    padding: 8,
  },
  monthText: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
  },
  entriesList: {
    gap: 12,
  },

  // HealthDiaryList - 메인 컨테이너
  diaryListContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  entryListCard: {
    backgroundColor: '#F8F9FA',
    borderWidth: 0.5,
    borderColor: '#02BFDC',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#02BFDC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  entryDate: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
    marginBottom: 8,
  },
  entryPreview: {
    fontFamily: 'Pretendard-Medium',
    color: '#777',
  },

  // 공통 추가 버튼
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#02BFDC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addIcon: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: '80%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: 'Pretendard-Medium',
      color: '#333333',
      marginBottom: 20,
      textAlign: 'center',
    },
    modalInput: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      fontFamily: 'Pretendard-Medium',
      color: '#333333',
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    modalCancelButton: {
      flex: 1,
      padding: 14,
      backgroundColor: '#F5F5F5',
      borderRadius: 12,
      alignItems: 'center',
    },
    modalCancelText: {
      fontSize: 16,
      fontFamily: 'Pretendard-Medium',
      color: '#666666',
    },
    modalConfirmButton: {
      flex: 1,
      padding: 14,
      backgroundColor: '#02BFDC',
      borderRadius: 12,
      alignItems: 'center',
    },
    modalConfirmText: {
      fontSize: 16,
      fontFamily: 'Pretendard-Medium',
      color: '#FFFFFF',
    },

    // 피커 모달
    pickerModalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      width: '80%',
      maxWidth: 300,
      maxHeight: '100%',
    },
    pickerList: {
      maxHeight: 300,
      marginBottom: 16,
    },
    pickerItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    pickerItemText: {
      fontSize: 18,
      fontFamily: 'Pretendard-Medium',
      color: '#333333',
      textAlign: 'center',
    },
    pickerCancelButton: {
      padding: 14,
      backgroundColor: '#F5F5F5',
      borderRadius: 12,
      alignItems: 'center',
    },
    pickerCancelText: {
      fontSize: 16,
      fontFamily: 'Pretendard-Medium',
      color: '#666666',
    },

    // 날짜 선택 모달
    datePickerModalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: '85%',
      maxWidth: 350,
    },
    datePickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 24,
      paddingHorizontal: 12,
    },
    dateArrowButton: {
      padding: 8,
    },
    datePickerArrow: {
      width: 24,
      height: 24,
      tintColor: '#333333',
    },
    datePickerText: {
      fontSize: 22,
      fontFamily: 'Pretendard-Medium',
      color: '#333333',
    },

    // 입력 필드 텍스트 스타일
    inputText: {
      fontFamily: 'Pretendard-Regular',
      color: '#333333',
    },
    inputPlaceholder: {
      fontFamily: 'Pretendard-Medium',
      color: '#999999',
    },

    // 약 수정 모달
    editMedicationModal: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: 370,
      height: 600
    },
    editModalField: {
      marginBottom: 20,
    },
    editModalLabel: {
      fontFamily: 'Pretendard-Medium',
      color: '#666666',
      marginBottom: 8,
    },
    editModalInput: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      padding: 14,
      fontSize: 18,
      fontFamily: 'Pretendard-Medium',
      color: '#333333',
    },
    editModalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deleteButton: {
      padding: 12,
      backgroundColor: '#FF4444',
      borderRadius: 10,
      paddingHorizontal: 20,
    },
    deleteButtonText: {
      fontSize: 16,
      fontFamily: 'Pretendard-Medium',
      color: '#FFFFFF',
    },
    editModalRightButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    editModalCancelButton: {
      padding: 12,
      backgroundColor: '#F5F5F5',
      borderRadius: 10,
      paddingHorizontal: 20,
    },
    editModalCancelText: {
      fontSize: 16,
      fontFamily: 'Pretendard-Medium',
      color: '#666666',
    },
    editModalSaveButton: {
      padding: 12,
      backgroundColor: '#02BFDC',
      borderRadius: 10,
      paddingHorizontal: 20,
    },
    editModalSaveText: {
      fontSize: 16,
      fontFamily: 'Pretendard-Medium',
      color: '#FFFFFF',
    },

    // 약 이름 컨테이너 (클릭 가능)
    medicationNameContainer: {
      flex: 1,
      paddingRight: 8,
    },

    // 빈 상태
    emptyStateContainer: {
      padding: 40,
      alignItems: 'center',
    },
    emptyStateText: {
      fontFamily: 'Pretendard-Medium',
      color: '#999999',
      textAlign: 'center',
    },
});


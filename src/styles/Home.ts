import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8E9F5',
  },

  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  backgroundImage: {
    position: 'absolute',
    width: '105%',
    height: 1000,
    top: 0,
    left: -5
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  greeting: {
    fontFamily: 'Pretendard-Bold',
    color: '#333',
  },

  // ✅ 퀵 메뉴 - 상단 고정
  quickMenuContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 35,
    justifyContent: 'space-between',
    zIndex: 10,
  },

  quickMenu: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  menuIcon: {
    width: 80,
    height: 80,
  },

  menuTitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#333',
  },

  // ✅ 캐릭터 영역 - 중앙
  characterSection: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  characterName: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 60,
    color: '#333',
    marginBottom: 20,
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  characterContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  characterImage: {
    width: 177,
    height: 274,
  },

  messageButton: {
    position: 'absolute',
    right: -50,
    top: -25,
  },

  messageIcon: {
    width: 80,
    height: 80,
  },

  // ✅ 포인트 영역 - 하단 고정
  pointContainer: {
    position: 'absolute',
    bottom: 150,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 25,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  pointSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  Icons: {
    width: 40,
    height: 40,
  },

  pointText: {
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
    fontSize: 20,
  },

  pointButton: {
    fontFamily: 'Pretendard-Medium',
    color: '#02BFDC',
    fontSize: 18,
  },

  // ✅ 좌측 버튼들
  leftButtonsContainer: {
    position: 'absolute',
    top: 270,
    left: 40,
    gap: 40,
  },

  leftButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonIcon: {
    width: 150,
    height: 150,
  },

  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6543',
  },
});

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
    height: 900,
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

  quickMenuContainer: {
    flexDirection: 'row',
    paddingHorizontal: 35,
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 40,
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

  characterSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },


  characterName: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 50,
    color: '#333',
    marginTop: 65,
    marginBottom: 14,
    textShadowColor: '#ffffff', // 하얀색 그림자 (테두리 역할)
    textShadowOffset: { width: 0, height: 0 }, // 그림자 위치 (중앙)
    textShadowRadius: 5, // 그림자 번짐 정도 (두께)
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  characterContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 90,
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

  pointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    bottom: 50,
    borderRadius: 25,
    gap: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    width: 385,
  },

  pointSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  Icons: {
    width: 40,
    height: 40,
  },

  pointText: {
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
  },

  pointButton: {
    fontFamily: 'Pretendard-Medium',
    color: '#02BFDC',
  },

  leftButtonsContainer: {
    position: 'absolute',
    top: 250,
    left: 20,
    gap: 15,
  },

  leftButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonIcon: {
    width: 113,
    height: 113,
  },

  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6543',
  },
});
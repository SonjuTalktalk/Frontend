// src/pages/ShopPage.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import PageHeader from '../../components/common/PageHeader';
import { usePoints } from '../../contexts/PointContext';
import { shopAPI } from '../../services/shop';
import { getCurrentBackgrounds, BACKGROUND_ITEMS } from '../../utils/backgroundConfig';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  imageUrl: any;
  category: 'accessory' | 'hat' | 'clothing';
  itemNumber: number;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'ribbon',
    name: '리본',
    price: 15,
    imageUrl: require('../../../assets/images/리본.png'),
    category: 'accessory',
    itemNumber: 1,
  },
  {
    id: 'glasses',
    name: '교복',
    price: 20,
    imageUrl: require('../../../assets/images/안경.png'),
    category: 'hat',
    itemNumber: 2,
  },
  {
    id: 'hiking-hat',
    name: '등산 모자',
    price: 20,
    imageUrl: require('../../../assets/images/등산모자.png'),
    category: 'hat',
    itemNumber: 3,
  },
  {
    id: 'bunny-band',
    name: '토끼 머리띠',
    price: 20,
    imageUrl: require('../../../assets/images/토끼머리띠.png'),
    category: 'accessory',
    itemNumber: 4,
  },
  {
    id: 'wizard-hat',
    name: '마법사 모자',
    price: 20,
    imageUrl: require('../../../assets/images/마법사모자.png'),
    category: 'hat',
    itemNumber: 5,
  },
  {
    id: 'crown',
    name: '왕관',
    price: 20,
    imageUrl: require('../../../assets/images/왕관.png'),
    category: 'accessory',
    itemNumber: 6,
  },
];

export default function ShopPage({ navigation }: any) {
  const { points, deductPoints, refreshPoints } = usePoints();
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [equippedItems, setEquippedItems] = useState<{
    [key: string]: string;
  }>({});
  const [purchasedBackgrounds, setPurchasedBackgrounds] = useState<string[]>([]);
  const [equippedBackground, setEquippedBackground] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [backgrounds, setBackgrounds] = useState<{
    bg1: any;
    bg2: any | null;
  }>({
    bg1: require('../../../assets/images/배경.png'),
    bg2: require('../../../assets/images/배경2.png'),
  });

  useEffect(() => {
    loadPurchasedItemsFromAPI();
    loadPurchasedBackgroundsFromAPI();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadEquippedItems();
      loadEquippedBackground();
      loadBackground();
      refreshPoints();
    }, [])
  );

  /**
   * API에서 구매한 아이템 목록 불러오기
   */
  const loadPurchasedItemsFromAPI = async () => {
    try {
      const response = await shopAPI.getBoughtItems();

      // API 응답을 아이템 ID 배열로 변환
      // item_number를 item_name(ID)으로 매핑
      const itemNumberToId: { [key: number]: string } = {
        1: 'ribbon',
        2: 'glasses',
        3: 'hiking-hat',
        4: 'bunny-band',
        5: 'wizard-hat',
        6: 'crown',
      };

      const purchasedIds = response.result
        .map(item => itemNumberToId[item.item_number])
        .filter(Boolean); // undefined 제거

      console.log('✅ 구매한 아이템:', purchasedIds);

      setPurchasedItems(purchasedIds);

      // AsyncStorage에도 저장 (오프라인 지원)
      await AsyncStorage.setItem('purchasedItems', JSON.stringify(purchasedIds));
    } catch (error) {
      console.error('구매 내역 API 로드 실패:', error);
      // API 실패 시 로컬 스토리지에서 로드
      await loadPurchasedItemsFromLocal();
    }
  };

  /**
   * API에서 구매한 배경 목록 불러오기
   */
  const loadPurchasedBackgroundsFromAPI = async () => {
    try {
      const response = await shopAPI.getBoughtBackgrounds();

      // API 응답을 배경 ID 배열로 변환
      const backgroundIds = response.result.map(bg => `background-${bg.background_number}`);

      console.log('✅ 구매한 배경:', backgroundIds);

      setPurchasedBackgrounds(backgroundIds);

      // AsyncStorage에도 저장 (오프라인 지원)
      await AsyncStorage.setItem('purchasedBackgrounds', JSON.stringify(backgroundIds));
    } catch (error) {
      console.error('배경 구매 내역 API 로드 실패:', error);
      // API 실패 시 로컬 스토리지에서 로드
      await loadPurchasedBackgroundsFromLocal();
    }
  };

  /**
   * 로컬 스토리지에서 구매한 아이템 불러오기 (폴백)
   */
  const loadPurchasedItemsFromLocal = async () => {
    try {
      const saved = await AsyncStorage.getItem('purchasedItems');
      if (saved) {
        setPurchasedItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('로컬 구매 내역 로드 실패:', error);
    }
  };

  /**
   * 로컬 스토리지에서 구매한 배경 불러오기 (폴백)
   */
  const loadPurchasedBackgroundsFromLocal = async () => {
    try {
      const saved = await AsyncStorage.getItem('purchasedBackgrounds');
      if (saved) {
        setPurchasedBackgrounds(JSON.parse(saved));
      }
    } catch (error) {
      console.error('로컬 배경 구매 내역 로드 실패:', error);
    }
  };

  const loadEquippedItems = async () => {
    try {
      const equipped = await AsyncStorage.getItem('equippedItems');
      if (equipped) {
        setEquippedItems(JSON.parse(equipped));
      }
    } catch (error) {
      console.error('착용 아이템 로드 실패:', error);
    }
  };

  const loadEquippedBackground = async () => {
    try {
      const equipped = await AsyncStorage.getItem('equippedBackground');
      if (equipped) {
        setEquippedBackground(equipped);
      }
    } catch (error) {
      console.error('착용 배경 로드 실패:', error);
    }
  };

  const loadBackground = async () => {
    try {
      const equippedBg = await AsyncStorage.getItem('equippedBackground');
      const bgs = getCurrentBackgrounds(equippedBg, 'main');
      setBackgrounds(bgs);
      console.log('✅ 상점 배경 로드:', equippedBg || '기본 배경');
    } catch (error) {
      console.error('배경 로드 실패:', error);
    }
  };

  const getCharacterImage = () => {
    const equippedItemIds = Object.values(equippedItems);

    if (equippedItemIds.includes('ribbon')) {
      return require('../../../assets/images/리본손주.png');
    }
    if (equippedItemIds.includes('hiking-hat')) {
      return require('../../../assets/images/등산손주.png');
    }
    if (equippedItemIds.includes('bunny-band')) {
      return require('../../../assets/images/토끼손주.png');
    }
    if (equippedItemIds.includes('wizard-hat')) {
      return require('../../../assets/images/마법사손주.png');
    }
    if (equippedItemIds.includes('crown')) {
      return require('../../../assets/images/왕손주.png');
    }
    if (equippedItemIds.includes('glasses')) {
      return require('../../../assets/images/교복손주.png');
    }

    return require('../../../assets/images/sonjusmile.png');
  };

  const handlePurchase = async (item: ShopItem) => {
    if (purchasedItems.includes(item.id)) {
      Alert.alert('알림', '이미 구매한 아이템입니다.');
      return;
    }

    if (points < item.price) {
      Alert.alert('포인트 부족', '포인트가 부족합니다!');
      return;
    }

    Alert.alert(
      '구매 확인',
      `${item.name}을(를) ${item.price} 포인트에 구매하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '구매',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await shopAPI.purchaseItem(item.itemNumber);
              console.log('✅ 구매 API 응답:', response.message);

              deductPoints(item.price);

              const newPurchased = [...purchasedItems, item.id];
              setPurchasedItems(newPurchased);
              await AsyncStorage.setItem(
                'purchasedItems',
                JSON.stringify(newPurchased)
              );

              await refreshPoints();

              Alert.alert('구매 완료', response.message || `${item.name}을(를) 구매했습니다!`);
            } catch (error: any) {
              console.error('❌ 구매 실패:', error);
              Alert.alert(
                '오류',
                error.message || '아이템 구매에 실패했습니다. 다시 시도해주세요.'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleBackgroundPurchase = async (background: typeof BACKGROUND_ITEMS[0]) => {
    if (purchasedBackgrounds.includes(background.id)) {
      Alert.alert('알림', '이미 구매한 배경입니다.');
      return;
    }

    if (points < background.price) {
      Alert.alert('포인트 부족', '포인트가 부족합니다!');
      return;
    }

    Alert.alert(
      '구매 확인',
      `${background.name}을(를) ${background.price} 포인트에 구매하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '구매',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await shopAPI.purchaseBackground(background.backgroundNumber);
              console.log('✅ 배경 구매 API 응답:', response.message);

              deductPoints(background.price);

              const newPurchased = [...purchasedBackgrounds, background.id];
              setPurchasedBackgrounds(newPurchased);
              await AsyncStorage.setItem(
                'purchasedBackgrounds',
                JSON.stringify(newPurchased)
              );

              await refreshPoints();

              Alert.alert('구매 완료', response.message || `${background.name}을(를) 구매했습니다!`);
            } catch (error: any) {
              console.error('❌ 배경 구매 실패:', error);
              Alert.alert(
                '오류',
                error.message || '배경 구매에 실패했습니다. 다시 시도해주세요.'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEquip = async (itemId: string, category: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    try {
      if (Object.keys(equippedItems).length > 0) {
        Alert.alert(
          '아이템 교체',
          '이미 착용 중인 아이템이 있습니다. 교체하시겠습니까?',
          [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '교체',
              onPress: async () => {
                setLoading(true);
                try {
                  const response = await shopAPI.equipItem(item.itemNumber);
                  console.log('✅ 장착 API 응답:', response.message);

                  const newEquipped = { [category]: itemId };
                  setEquippedItems(newEquipped);
                  await AsyncStorage.setItem(
                    'equippedItems',
                    JSON.stringify(newEquipped)
                  );

                } catch (error: any) {
                  console.error('❌ 장착 실패:', error);
                  Alert.alert(
                    '오류',
                    error.message || '아이템 장착에 실패했습니다. 다시 시도해주세요.'
                  );
                } finally {
                  setLoading(false);
                }
              },
            },
          ]
        );
      } else {
        setLoading(true);
        try {
          const response = await shopAPI.equipItem(item.itemNumber);
          console.log('✅ 장착 API 응답:', response.message);

          const newEquipped = { [category]: itemId };
          setEquippedItems(newEquipped);
          await AsyncStorage.setItem(
            'equippedItems',
            JSON.stringify(newEquipped)
          );

          Alert.alert('착용 완료', response.message || `아이템이 장착되었습니다!`);
        } catch (error: any) {
          console.error('❌ 장착 실패:', error);
          Alert.alert(
            '오류',
            error.message || '아이템 장착에 실패했습니다. 다시 시도해주세요.'
          );
        } finally {
          setLoading(false);
        }
      }
    } catch (error: any) {
      console.error('❌ 착용 처리 오류:', error);
    }
  };

  const handleBackgroundEquip = async (backgroundId: string) => {
    const background = BACKGROUND_ITEMS.find(b => b.id === backgroundId);
    if (!background) return;

    try {
      if (equippedBackground) {
        Alert.alert(
          '배경 교체',
          '이미 착용 중인 배경이 있습니다. 교체하시겠습니까?',
          [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '교체',
              onPress: async () => {
                setLoading(true);
                try {
                  const response = await shopAPI.equipBackground(background.backgroundNumber);
                  console.log('✅ 배경 장착 API 응답:', response.message);

                  setEquippedBackground(backgroundId);
                  await AsyncStorage.setItem('equippedBackground', backgroundId);

                  // 배경 즉시 변경
                  await loadBackground();

                  Alert.alert('착용 완료', response.message || '배경이 장착되었습니다!');
                } catch (error: any) {
                  console.error('❌ 배경 장착 실패:', error);
                  Alert.alert(
                    '오류',
                    error.message || '배경 장착에 실패했습니다. 다시 시도해주세요.'
                  );
                } finally {
                  setLoading(false);
                }
              },
            },
          ]
        );
      } else {
        setLoading(true);
        try {
          const response = await shopAPI.equipBackground(background.backgroundNumber);
          console.log('✅ 배경 장착 API 응답:', response.message);

          setEquippedBackground(backgroundId);
          await AsyncStorage.setItem('equippedBackground', backgroundId);

          // 배경 즉시 변경
          await loadBackground();

          Alert.alert('착용 완료', response.message || '배경이 장착되었습니다!');
        } catch (error: any) {
          console.error('❌ 배경 장착 실패:', error);
          Alert.alert(
            '오류',
            error.message || '배경 장착에 실패했습니다. 다시 시도해주세요.'
          );
        } finally {
          setLoading(false);
        }
      }
    } catch (error: any) {
      console.error('❌ 배경 착용 처리 오류:', error);
    }
  };

  const handleUnequip = async (category: string) => {
    setLoading(true);
    try {
      const response = await shopAPI.unequipItem();
      console.log('✅ 해제 API 응답:', response.message);

      const newEquipped = { ...equippedItems };
      delete newEquipped[category];
      setEquippedItems(newEquipped);
      await AsyncStorage.setItem(
        'equippedItems',
        JSON.stringify(newEquipped)
      );

      Alert.alert('해제 완료', response.message || '아이템을 해제했습니다.');
    } catch (error: any) {
      console.error('❌ 해제 실패:', error);
      Alert.alert(
        '오류',
        error.message || '아이템 장착 해제에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundUnequip = async () => {
    setLoading(true);
    try {
      const response = await shopAPI.unequipBackground();
      console.log('✅ 배경 해제 API 응답:', response.message);

      setEquippedBackground(null);
      await AsyncStorage.removeItem('equippedBackground');

      // 배경 즉시 변경 (기본 배경으로)
      await loadBackground();

      Alert.alert('해제 완료', response.message || '배경을 해제했습니다.');
    } catch (error: any) {
      console.error('❌ 배경 해제 실패:', error);
      Alert.alert(
        '오류',
        error.message || '배경 장착 해제에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderShopItem = (item: ShopItem) => {
    const isPurchased = purchasedItems.includes(item.id);
    const isEquipped = equippedItems[item.category] === item.id;
    const canAfford = points >= item.price;

    return (
      <View key={item.id} style={styles.itemCard}>
        <TouchableOpacity
          onPress={() => !isPurchased && !loading && handlePurchase(item)}
          disabled={isPurchased || loading}
        >
          <View
            style={[
              styles.itemImageContainer,
              isEquipped && styles.equippedItemContainer,
            ]}
          >
            <Image
              source={item.imageUrl}
              style={styles.itemImage}
              resizeMode="contain"
            />
          </View>

          <ScaledText fontSize={16} style={styles.itemName}>
            {item.name}
          </ScaledText>
        </TouchableOpacity>

        {isPurchased ? (
          isEquipped ? (
            <TouchableOpacity
              style={[styles.unequipButton, loading && styles.buttonDisabled]}
              onPress={() => !loading && handleUnequip(item.category)}
              disabled={loading}
            >
              <ScaledText fontSize={14} style={styles.unequipText}>
                해제하기
              </ScaledText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.equipButton, loading && styles.buttonDisabled]}
              onPress={() => !loading && handleEquip(item.id, item.category)}
              disabled={loading}
            >
              <ScaledText fontSize={14} style={styles.equipText}>
                착용하기
              </ScaledText>
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity
            style={[
              styles.priceButton,
              (!canAfford || loading) && styles.priceButtonDisabled,
            ]}
            onPress={() => !loading && handlePurchase(item)}
            disabled={!canAfford || loading}
          >
            <ScaledText
              fontSize={14}
              style={[
                styles.priceText,
                (!canAfford || loading) && styles.priceTextDisabled,
              ]}
            >
              {item.price} 포인트
            </ScaledText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderBackgroundItem = (background: typeof BACKGROUND_ITEMS[0]) => {
    const isPurchased = purchasedBackgrounds.includes(background.id);
    const isEquipped = equippedBackground === background.id;
    const canAfford = points >= background.price;

    return (
      <View key={background.id} style={styles.itemCard}>
        <TouchableOpacity
          onPress={() => !isPurchased && !loading && handleBackgroundPurchase(background)}
          disabled={isPurchased || loading}
        >
          <View
            style={[
              styles.itemImageContainer,
              isEquipped && styles.equippedItemContainer,
            ]}
          >
            <Image
              source={background.previewImageUrl}
              style={styles.itemImage}
              resizeMode="contain"
            />
          </View>

          <ScaledText fontSize={16} style={styles.itemName}>
            {background.name}
          </ScaledText>
        </TouchableOpacity>

        {isPurchased ? (
          isEquipped ? (
            <TouchableOpacity
              style={[styles.unequipButton, loading && styles.buttonDisabled]}
              onPress={() => !loading && handleBackgroundUnequip()}
              disabled={loading}
            >
              <ScaledText fontSize={14} style={styles.unequipText}>
                해제하기
              </ScaledText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.equipButton, loading && styles.buttonDisabled]}
              onPress={() => !loading && handleBackgroundEquip(background.id)}
              disabled={loading}
            >
              <ScaledText fontSize={14} style={styles.equipText}>
                착용하기
              </ScaledText>
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity
            style={[
              styles.priceButton,
              (!canAfford || loading) && styles.priceButtonDisabled,
            ]}
            onPress={() => !loading && handleBackgroundPurchase(background)}
            disabled={!canAfford || loading}
          >
            <ScaledText
              fontSize={14}
              style={[
                styles.priceText,
                (!canAfford || loading) && styles.priceTextDisabled,
              ]}
            >
              {background.price} 포인트
            </ScaledText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 배경 이미지 - 동적으로 변경 */}
      <Image
        source={backgrounds.bg1}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      {backgrounds.bg2 && (
        <Image
          source={backgrounds.bg2}
          style={styles.backgroundImage2}
          resizeMode="cover"
        />
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#02BFDC" />
            <ScaledText fontSize={16} style={styles.loadingText}>
              처리 중...
            </ScaledText>
          </View>
        </View>
      )}

      <PageHeader title="상점" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!loading}
      >
        <ScaledText fontSize={20} style={styles.description}>
          마음에 드는 아이템을 구매해요
        </ScaledText>

        <View style={styles.characterSection}>
          <ScaledText fontSize={22} style={styles.sectionTitle}>
            돌쇠의 현재 모습
          </ScaledText>

          <View style={styles.characterPreview}>
            <Image
              source={getCharacterImage()}
              style={styles.characterImage}
              resizeMode="contain"
            />

            {Object.keys(equippedItems).length > 0 && (
              <View style={styles.equippedItemsDisplay}>
                <ScaledText fontSize={14} style={styles.equippedText}>
                  착용 중:{' '}
                  {Object.values(equippedItems)
                    .map(itemId => {
                      const item = SHOP_ITEMS.find(i => i.id === itemId);
                      return item?.name;
                    })
                    .filter(Boolean)
                    .join(', ')}
                </ScaledText>
              </View>
            )}
          </View>

          <View style={styles.pointContainer}>
            <ScaledText fontSize={24} style={styles.pointText}>
              {points} 포인트
            </ScaledText>
            <Image
              source={require('../../../assets/images/코인.png')}
              style={styles.coinIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* 아이템 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ScaledText fontSize={24} style={styles.sectionHeaderTitle}>
              아이템
            </ScaledText>
            <ScaledText fontSize={18} style={styles.sectionHeaderSubtitle}>
              캐릭터를 꾸며보세요
            </ScaledText>
          </View>
          <View style={styles.itemGrid}>
            {SHOP_ITEMS.sort((a, b) => {
              const aOwned = purchasedItems.includes(a.id);
              const bOwned = purchasedItems.includes(b.id);
              if (aOwned && !bOwned) return -1;
              if (!aOwned && bOwned) return 1;
              return 0;
            }).map(item => renderShopItem(item))}
          </View>
        </View>

        {/* 배경 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ScaledText fontSize={24} style={styles.sectionHeaderTitle}>
              배경
            </ScaledText>
            <ScaledText fontSize={18} style={styles.sectionHeaderSubtitle}>
              화면 배경을 변경해보세요
            </ScaledText>
          </View>
          <View style={styles.itemGrid}>
            {BACKGROUND_ITEMS.sort((a, b) => {
              const aOwned = purchasedBackgrounds.includes(a.id);
              const bOwned = purchasedBackgrounds.includes(b.id);
              if (aOwned && !bOwned) return -1;
              if (!aOwned && bOwned) return 1;
              return 0;
            }).map(background => renderBackgroundItem(background))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8E9F5',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: 480,
    top: 250,
    left: 0,
  },
  backgroundImage2: {
    position: 'absolute',
    width: '100%',
    height: 183,
    top: 730,
    left: 0,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    gap: 15,
  },
  loadingText: {
    fontFamily: 'Pretendard-Medium',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  description: {
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  characterSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  characterPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#02BFDC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
    width: '100%',
  },
  characterImage: {
    width: 250,
    height: 250,
  },
  equippedItemsDisplay: {
    marginTop: 15,
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#02BFDC',
  },
  equippedText: {
    fontFamily: 'Pretendard-Medium',
    color: '#02BFDC',
    textAlign: 'center',
  },
  pointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#02BFDC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pointText: {
    fontFamily: 'Pretendard-Medium',
    color: '#1F2937',
  },
  coinIcon: {
    width: 24,
    height: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
  },
  sectionHeaderTitle: {
    fontFamily: 'Pretendard-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionHeaderSubtitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  itemCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#5F6C7B',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  equippedItemContainer: {
    borderWidth: 3,
    borderColor: '#02BFDC',
  },
  itemImage: {
    width: '70%',
    height: '70%',
  },
  itemName: {
    fontFamily: 'Pretendard-Medium',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  priceButton: {
    backgroundColor: '#02BFDC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  priceButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  priceText: {
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
    fontSize: 12,
  },
  priceTextDisabled: {
    color: '#9CA3AF',
  },
  equipButton: {
    backgroundColor: '#02BFDC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  equipText: {
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
    fontSize: 12,
  },
  unequipButton: {
    backgroundColor: '#9CA3AF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  unequipText: {
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
    fontSize: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
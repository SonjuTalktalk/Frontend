import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import PageHeader from '../../components/common/PageHeader';
import InventoryItemCard from '../../components/shop/InventoryItemCard';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  imageUrl: any;
  category: 'accessory' | 'hat' | 'clothing';
}

const ALL_ITEMS: ShopItem[] = [
  {
    id: 'ribbon',
    name: '리본',
    price: 15,
    imageUrl: require('../../../assets/images/리본.png'),
    category: 'accessory',
  },
  {
    id: 'glasses',
    name: '교복',
    price: 20,
    imageUrl: require('../../../assets/images/안경.png'),
    category: 'hat',
  },
  {
    id: 'hiking-hat',
    name: '등산 모자',
    price: 20,
    imageUrl: require('../../../assets/images/등산모자.png'),
    category: 'hat',
  },
  {
    id: 'bunny-band',
    name: '토끼 머리띠',
    price: 20,
    imageUrl: require('../../../assets/images/토끼머리띠.png'),
    category: 'accessory',
  },
  {
    id: 'wizard-hat',
    name: '마법사 모자',
    price: 20,
    imageUrl: require('../../../assets/images/마법사모자.png'),
    category: 'hat',
  },
  {
    id: 'crown',
    name: '왕관',
    price: 20,
    imageUrl: require('../../../assets/images/왕관.png'),
    category: 'accessory',
  },
];

export default function InventoryPage({ navigation }: any) {
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [equippedItems, setEquippedItems] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 구매한 아이템 로드
      const purchased = await AsyncStorage.getItem('purchasedItems');
      if (purchased) {
        setPurchasedItems(JSON.parse(purchased));
      }

      // 착용 중인 아이템 로드
      const equipped = await AsyncStorage.getItem('equippedItems');
      if (equipped) {
        setEquippedItems(JSON.parse(equipped));
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  const handleEquip = async (itemId: string, category: string) => {
    try {
      // 기존 착용 아이템이 있으면 경고
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
                // 모든 아이템 해제 후 새 아이템만 착용
                const newEquipped = { [category]: itemId };
                setEquippedItems(newEquipped);
                await AsyncStorage.setItem('equippedItems', JSON.stringify(newEquipped));

                const item = ALL_ITEMS.find(i => i.id === itemId);
                Alert.alert('착용 완료', `${item?.name}을(를) 착용했습니다!`);

                console.log('✅ 아이템 착용:', itemId, category);
              },
            },
          ]
        );
      } else {
        // 착용 중인 아이템이 없으면 바로 착용
        const newEquipped = { [category]: itemId };
        setEquippedItems(newEquipped);
        await AsyncStorage.setItem('equippedItems', JSON.stringify(newEquipped));

        const item = ALL_ITEMS.find(i => i.id === itemId);
        Alert.alert('착용 완료', `${item?.name}을(를) 착용했습니다!`);

        console.log('✅ 아이템 착용:', itemId, category);
      }
    } catch (error) {
      console.error('착용 실패:', error);
      Alert.alert('오류', '착용에 실패했습니다.');
    }
  };

  const handleUnequip = async (category: string) => {
    try {
      const newEquipped = { ...equippedItems };
      delete newEquipped[category];
      setEquippedItems(newEquipped);
      await AsyncStorage.setItem('equippedItems', JSON.stringify(newEquipped));
      
      Alert.alert('해제 완료', '아이템을 해제했습니다.');
      
      console.log('✅ 아이템 해제:', category);
    } catch (error) {
      console.error('해제 실패:', error);
      Alert.alert('오류', '해제에 실패했습니다.');
    }
  };

  // 착용한 아이템에 따른 캐릭터 이미지 선택
  const getCharacterImage = () => {
    // 착용한 아이템 확인
    const equippedItemIds = Object.values(equippedItems);

    // 착용한 아이템이 있으면 해당 이미지 반환
    if (equippedItemIds.includes('glasses')){
      return require('../../../assets/images/교복손주.png');
    }
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

    // 기본 이미지
    return require('../../../assets/images/sonjusmile.png');
  };

  // 구매한 아이템만 필터링 및 정렬
  const myItems = ALL_ITEMS
    .filter(item => purchasedItems.includes(item.id))
    .sort((a, b) => {
      // 1. 카테고리별로 먼저 정렬
      if (a.category !== b.category) {
        const categoryOrder = { hat: 1, accessory: 2, clothing: 3 };
        return categoryOrder[a.category] - categoryOrder[b.category];
      }
      // 2. 같은 카테고리 내에서는 이름순으로 정렬
      return a.name.localeCompare(b.name, 'ko');
    });

  return (
    <View style={styles.container}>
      {/* 배경 이미지 */}
      <Image
        source={require('../../../assets/images/배경.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* 헤더 */}
      <PageHeader
        title="내 보관함"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 캐릭터 미리보기 */}
        <View style={styles.previewSection}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            돌쇠의 현재 모습
          </ScaledText>
          
          <View style={styles.characterPreview}>
            <Image
              source={getCharacterImage()}
              style={styles.characterImage}
              resizeMode="contain"
            />
            
            {/* 착용 중인 아이템 표시 */}
            {Object.keys(equippedItems).length > 0 && (
              <View style={styles.equippedItemsDisplay}>
                <ScaledText fontSize={14} style={styles.equippedText}>
                  착용 중: {Object.values(equippedItems).map(itemId => {
                    const item = ALL_ITEMS.find(i => i.id === itemId);
                    return item?.name;
                  }).filter(Boolean).join(', ')}
                </ScaledText>
              </View>
            )}
          </View>
        </View>

        {/* 보관함 아이템 */}
        <View style={styles.inventorySection}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            보유 중인 아이템 ({myItems.length}개)
          </ScaledText>

          {myItems.length === 0 ? (
            <View style={styles.emptyState}>
              <ScaledText fontSize={40}>📦</ScaledText>
              <ScaledText fontSize={16} style={styles.emptyText}>
                아직 구매한 아이템이 없어요
              </ScaledText>
              <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate('Shop')}
              >
                <ScaledText fontSize={16} style={styles.shopButtonText}>
                  상점 가기
                </ScaledText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.itemGrid}>
              {myItems.map((item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  isEquipped={equippedItems[item.category] === item.id}
                  onEquip={handleEquip}
                  onUnequip={handleUnequip}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F9FB',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  previewSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Pretendard-Bold',
    color: '#1F2937',
    marginBottom: 15,
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
  inventorySection: {
    marginBottom: 20,
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: '#02BFDC',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#02BFDC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  shopButtonText: {
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
  },
});
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ScaledText from '../ScaledText';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  imageUrl: any;
  category: 'accessory' | 'hat' | 'clothing';
}

interface InventoryItemCardProps {
  item: ShopItem;
  isEquipped: boolean;
  onEquip: (itemId: string, category: string) => void;
  onUnequip: (category: string) => void;
}

const InventoryItemCard = ({
  item,
  isEquipped,
  onEquip,
  onUnequip
}: InventoryItemCardProps) => {
  return (
    <View
      style={[
        styles.card,
        isEquipped && styles.equippedCard,
      ]}
    >
      <View style={styles.cardContent}>
        {/* 아이템 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={item.imageUrl}
            style={styles.itemImage}
            resizeMode="contain"
          />

          {/* 착용 중 표시 */}
          {isEquipped && (
            <View style={styles.equippedBadge}>
              <ScaledText fontSize={12} style={styles.checkIcon}>
                ✓
              </ScaledText>
            </View>
          )}
        </View>
        
        {/* 아이템 이름 */}
        <ScaledText fontSize={14} style={styles.itemName}>
          {item.name}
        </ScaledText>
        
        {/* 착용/해제 버튼 */}
        {isEquipped ? (
          <TouchableOpacity
            style={styles.unequipButton}
            onPress={() => onUnequip(item.category)}
          >
            <ScaledText fontSize={14} style={styles.unequipButtonText}>
              착용 해제
            </ScaledText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.equipButton}
            onPress={() => onEquip(item.id, item.category)}
          >
            <ScaledText fontSize={14} style={styles.equipButtonText}>
              착용하기
            </ScaledText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  equippedCard: {
    backgroundColor: '#E0F7FA',
    borderWidth: 2,
    borderColor: '#02BFDC',
    shadowColor: '#02BFDC',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cardContent: {
    alignItems: 'center',
    gap: 8,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#5F6C7B',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  itemImage: {
    width: '70%',
    height: '70%',
  },
  equippedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#02BFDC',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
  },
  itemName: {
    fontFamily: 'Pretendard-Medium',
    color: '#1F2937',
    textAlign: 'center',
  },
  equipButton: {
    backgroundColor: '#02BFDC',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  equipButtonText: {
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
  },
  unequipButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#02BFDC',
  },
  unequipButtonText: {
    fontFamily: 'Pretendard-Medium',
    color: '#02BFDC',
  },
});

export default InventoryItemCard;
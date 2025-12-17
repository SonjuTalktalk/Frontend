import { StyleSheet } from 'react-native';

export const ITEM_HEIGHT = 50;
export const VISIBLE_ITEMS = 5;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8E9F5',
  },
  header: {
    fontFamily: 'Pretendard-Medium',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
    gap: 12,
  },
  title: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#000',
    paddingHorizontal: 40,
    marginTop: 4,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    marginBottom: 20
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#999',
    marginBottom: 12,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#02BFDC',
    borderColor: '#02BFDC',
  },
  checkmark: {
    color: '#fff',
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    color: '#000',
    marginBottom: 4,
  },
  todoTitleCompleted: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  todoDate: {
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#999',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    alignItems: 'flex-end',
    gap: 2,
    marginBottom: 130,
  },
  secondaryFab: {
    marginBottom: 8,
  },
  fabButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 1,
  },
  mainFabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#02BFDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryFabButton: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    maxWidth: 190,
    paddingVertical: 30,
    borderRadius: 30,
    backgroundColor: '#02BFDC',
    alignItems: 'center',
    gap: 8,
  },
  fabButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  plusIcon: {
    width: 32,
    height: 32,
    tintColor: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalCloseButton: {
    color: '#000',
    width: 40,
  },
  modalTitle: {
    color: '#000',
    fontWeight: '600',
  },
  modalSaveButton: {
    color: '#02BFDC',
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  inputSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  titleInput: {
    padding: 0,
    color: '#000',
  },
  settingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    color: '#000',
  },
  settingValue: {
    color: '#999',
  },
  deleteButton: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  pickerCancelButton: {
    color: '#999',
  },
  pickerTitle: {
    color: '#000',
    fontWeight: '600',
  },
  pickerDoneButton: {
    color: '#02BFDC',
    fontWeight: '600',
  },
  pickerContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  pickerColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
  },
  pickerScrollContent: {
    paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    color: '#999',
  },
  pickerItemTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  pickerUnit: {
    marginTop: 4,
    marginBottom: 8,
    color: '#666',
  },
  pickerSelectionIndicator: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: '57%',
    height: ITEM_HEIGHT,
    marginTop: -ITEM_HEIGHT / 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    pointerEvents: 'none',
  },
  dateTimePicker: {
    height: 200,
  },
});
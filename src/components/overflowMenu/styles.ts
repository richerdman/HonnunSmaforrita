import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export default StyleSheet.create({
  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  menuDots: {
    fontSize: 20,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  menu: {
    position: 'absolute',
    right: 400,
    top: 36,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    minWidth: 150,
    // shadow on iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // elevation on Android
    elevation: 12,
    zIndex: 9999,
    padding: 0,
    overflow: 'visible',
  },
  menuInner: {
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    paddingVertical: 6,
    minWidth: 150,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuText: {
    color: COLORS.textPrimary,
  },
  menuDeleteItem: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteTxt: { color: '#fff' },
});

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
    fontSize: 22,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  menu: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    minWidth: 200,
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
    minWidth: 200,
  },
  menuHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  menuHeaderText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
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

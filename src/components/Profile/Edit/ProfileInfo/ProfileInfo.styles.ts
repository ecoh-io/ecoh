import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  profileTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    gap: 5,
  },
  name: {
    fontSize: typography.fontSizes.title,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  username: {
    fontSize: typography.fontSizes.smallTitle,
    fontFamily: typography.fontFamilies.poppins.medium,
    opacity: 0.5,
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '100%',
    height: '95%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  modalTitle: {
    fontSize: typography.fontSizes.headline,
    fontFamily: typography.fontFamilies.poppins.semiBold,
    color: 'white',
    marginBottom: 35,
  },
  modalImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 100, // Makes the image circular
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: 'rgba(265,265,265,0.6)',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  confirmButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00C851',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

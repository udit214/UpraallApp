import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getMimeType = (fileUri) => {
  const extension = fileUri.split('.').pop().toLowerCase();
  const mimeTypes = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

const DocumentPreview = () => {
  const route = useRoute();
  const { document } = route.params;
  const { width, height } = Dimensions.get('window');

  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  const mimeType = getMimeType(document.file);

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading authentication...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>{document.title}</Text>

      {mimeType.startsWith('image/') ? (
        <ImageZoom
          cropWidth={width - 32}
          cropHeight={height - 150}
          imageWidth={width - 32}
          imageHeight={height - 150}
        >
          <Image
            source={{ uri: document.file }}
            style={styles.image}
            resizeMode="contain"
          />
        </ImageZoom>
      ) : mimeType === 'application/pdf' ? (
        <Pdf
          source={{
            uri: document.file,
            cache: true,
            headers: {
              Authorization: `Token ${token}`,
            },
          }}
          style={styles.pdf}
          trustAllCerts={false} // set true only if you want to ignore SSL errors (not recommended)
          onError={(error) => {
            console.log('PDF load error:', error);
          }}
        />
      ) : (
        <Text style={styles.unsupportedText}>
          This document type is not supported for preview.
        </Text>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#121212',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  unsupportedText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DocumentPreview;

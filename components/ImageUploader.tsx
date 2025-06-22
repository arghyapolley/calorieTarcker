import React, { useState } from 'react';
import {
  View,
  Button,
  Image,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const ImageUploader = () => {
  const [image, setImage] = useState<any>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [foodLabel, setFoodLabel] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (res) => {
      if (res.assets && res.assets.length > 0) {
        setImage(res.assets[0]);
        setCalories(null);
        setFoodLabel('');
      }
    });
  };

  const uploadImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: image.fileName || 'photo.jpg',
      type: image.type || 'image/jpeg',
    } as any);

    setLoading(true);
    try {
      const response = await axios.post('http://<YOUR_LOCAL_IP>:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCalories(response.data.calories);
      setFoodLabel(response.data.food);
    } catch (err) {
      Alert.alert('Error', 'Failed to upload image or analyze.');
    }
    setLoading(false);
  };

  return (
    <View>
      <Button title="Select Image" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image.uri }} style={{ width: '100%', height: 200, marginVertical: 10 }} />
      )}
      {image && <Button title="Upload & Analyze" onPress={uploadImage} />}
      {loading && <ActivityIndicator size="large" style={{ marginTop: 10 }} />}
      {calories !== null && (
        <Text style={styles.result}>
          🍎 Food: {foodLabel}{"\n"}🔥 Calories: {calories} kcal
        </Text>
      )}
    </View>
  );
};

export default ImageUploader;

const styles = StyleSheet.create({
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
  },
});

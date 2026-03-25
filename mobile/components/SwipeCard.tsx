import { View, Text, Image, StyleSheet } from 'react-native';
import { FoodItem } from '@/data/dummyData';

type Props = {
  item: FoodItem;
};

export default function SwipeCard({ item }: Props) {
  return (
    <View style={styles.card}>
      {/* Image */}
      <Image source={{ uri: item.image }} style={styles.image} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {/* Tags */}
        <View style={styles.tags}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Swipe hint */}
      <View style={styles.hint}>
        <View style={styles.hintCol}>
          <Text style={[styles.hintLabel, { color: '#f87171' }]}>Skip</Text>
          <Text style={styles.hintArrow}>←</Text>
        </View>
        <View style={styles.hintCol}>
          <Text style={[styles.hintLabel, { color: '#4ade80' }]}>Like</Text>
          <Text style={styles.hintArrow}>→</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    height: 480,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: 256,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937', // gray-800
  },
  description: {
    fontSize: 14,
    color: '#6b7280', // gray-500
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#ffedd5', // orange-100
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    color: '#ea580c', // orange-600
    fontWeight: '500',
  },
  hint: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hintCol: {
    alignItems: 'center',
  },
  hintLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  hintArrow: {
    fontSize: 20,
    color: '#1f2937',
  },
});

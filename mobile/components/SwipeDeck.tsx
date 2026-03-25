// Ported from my-app/components/SwipeDeck.tsx
// framer-motion replaced with react-native-reanimated + react-native-gesture-handler
// All swipe thresholds, rotation math, and opacity math are preserved from the original.

import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import SwipeCard from './SwipeCard';
import { dummyItems, FoodItem } from '@/data/dummyData';

// Original threshold was 100 (info.offset.x > 100)
const SWIPE_THRESHOLD = 100;

function DraggableCard({
  item,
  onSwipe,
}: {
  item: FoodItem;
  onSwipe: (dir: 'left' | 'right', item: FoodItem) => void;
}) {
  const x = useSharedValue(0);

  // Gesture replaces framer-motion drag="x" + dragConstraints + onDragEnd
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      x.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(onSwipe)('right', item);
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(onSwipe)('left', item);
      } else {
        // Snap back — equivalent to dragConstraints releasing
        x.value = withSpring(0);
      }
    });

  // Replicates framer-motion useTransform:
  //   rotate: x [-200, 200] → [-25, 25] deg
  //   opacity: x [-200, -100, 0, 100, 200] → [0, 1, 1, 1, 0]
  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      x.value,
      [-200, 200],
      [-25, 25],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      x.value,
      [-200, -100, 0, 100, 200],
      [0, 1, 1, 1, 0],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateX: x.value }, { rotate: `${rotate}deg` }],
      opacity,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.cardWrapper, animatedStyle]}>
        <SwipeCard item={item} />
      </Animated.View>
    </GestureDetector>
  );
}

export default function SwipeDeck() {
  const [items, setItems] = useState<FoodItem[]>(dummyItems);
  const [liked, setLiked] = useState<FoodItem[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const onSwipe = (dir: 'left' | 'right', item: FoodItem) => {
    if (dir === 'right') {
      setLiked((prev) => [...prev, item]);
      setLastAction(`Liked ${item.name}`);
    } else {
      setLastAction(`Skipped ${item.name}`);
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>You've seen everything!</Text>
        <Text style={styles.emptySubtitle}>
          Liked {liked.length} {liked.length === 1 ? 'item' : 'items'}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setItems(dummyItems);
            setLiked([]);
            setLastAction(null);
          }}
          style={styles.resetButton}
        >
          <Text style={styles.resetButtonText}>Start Over</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Card stack — position absolute cards, same stacking as original */}
      <View style={styles.deck}>
        {items.map((item) => (
          <DraggableCard key={item.id} item={item} onSwipe={onSwipe} />
        ))}
      </View>

      {lastAction && <Text style={styles.lastAction}>{lastAction}</Text>}

      <Text style={styles.stats}>
        {liked.length} liked · {items.length} remaining
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 24,
  },
  deck: {
    width: 320,
    height: 480,
  },
  cardWrapper: {
    position: 'absolute',
  },
  emptyContainer: {
    alignItems: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    textAlign: 'center',
    color: '#3b82f6',
  },
  emptySubtitle: {
    color: '#6b7280',
  },
  resetButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#f97316', // orange-500
    borderRadius: 999,
  },
  resetButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  lastAction: {
    fontSize: 14,
    color: '#6b7280',
    height: 20,
  },
  stats: {
    fontSize: 14,
    color: '#9ca3af',
  },
});

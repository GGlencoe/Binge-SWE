import { Link, usePathname } from 'expo-router';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (path: string) => pathname === path;

  return (
    <View style={[styles.nav, { paddingBottom: insets.bottom }]}>
      <View style={styles.inner}>

        <Link href="/recipes" asChild>
          <Pressable style={styles.tab}>
            <Ionicons name="restaurant" size={24} color={isActive('/recipes') ? '#f97316' : '#6b7280'} />
            <Text style={[styles.label, isActive('/recipes') && styles.activeLabel]}>Recipes</Text>
          </Pressable>
        </Link>

        <Link href="/profile" asChild>
          <Pressable style={styles.tab}>
            <Ionicons name="person" size={24} color={isActive('/profile') ? '#f97316' : '#6b7280'} />
            <Text style={[styles.label, isActive('/profile') && styles.activeLabel]}>Profile</Text>
          </Pressable>
        </Link>

        <Link href="/restaurants" asChild>
          <Pressable style={styles.tab}>
            <Ionicons name="storefront" size={24} color={isActive('/restaurants') ? '#f97316' : '#6b7280'} />
            <Text style={[styles.label, isActive('/restaurants') && styles.activeLabel]}>Restaurants</Text>
          </Pressable>
        </Link>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 4,
  },
  activeLabel: {
    color: '#f97316',
  },
});

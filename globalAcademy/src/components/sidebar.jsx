import { Pressable, StyleSheet, Text, View } from 'react-native';

const items = [
  { key: 'home', label: 'Início' },
  { key: 'courses', label: 'Cursos' },
  { key: 'progress', label: 'Progresso' },
  { key: 'profile', label: 'Perfil' },
];

export default function Sidebar({ active = 'home', onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>globalAcademy</Text>
      <View style={styles.list}>
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <Pressable
              key={item.key}
              onPress={() => onSelect?.(item.key)}
              style={[styles.item, isActive && styles.itemActive]}
            >
              <Text style={[styles.itemText, isActive && styles.itemTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: '#0F172A',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  brand: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 24,
  },
  list: { gap: 4 },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  itemActive: { backgroundColor: '#208AEF' },
  itemText: { color: '#CBD5E1', fontSize: 15 },
  itemTextActive: { color: '#FFFFFF', fontWeight: '600' },
});

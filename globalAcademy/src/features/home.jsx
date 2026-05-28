import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Sidebar from '../components/sidebar';

export default function Home() {
  const [active, setActive] = useState('home');

  return (
    <View style={styles.container}>
      <Sidebar active={active} onSelect={setActive} />
      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
        <Text style={styles.title}>Bem-vindo de volta 👋</Text>
        <Text style={styles.subtitle}>Continue de onde parou</Text>

        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Cursos ativos</Text>
            <Text style={styles.cardValue}>3</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Horas estudadas</Text>
            <Text style={styles.cardValue}>12h</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Conquistas</Text>
            <Text style={styles.cardValue}>5</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Seção: {active}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#F1F5F9' },
  main: { flex: 1 },
  mainContent: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  subtitle: { fontSize: 15, color: '#475569' },
  cardsRow: { flexDirection: 'row', gap: 12, marginTop: 12, flexWrap: 'wrap' },
  card: {
    flexGrow: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardLabel: { color: '#64748B', fontSize: 13 },
  cardValue: { color: '#0F172A', fontSize: 24, fontWeight: '700', marginTop: 4 },
  sectionTitle: { marginTop: 24, fontSize: 16, fontWeight: '600', color: '#0F172A' },
});

import { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { useStickersStore } from '@/stores/stickers-store';
import { useUserStickersStore } from '@/stores/user-stickers-store';
import { Star, Copy, TrendingUp, TrendingDown, Award, Layers } from 'lucide-react-native';
import { SECTION_MAP } from '@/components/shared/section-filter-modal';

const NON_TEAM_SECTIONS = new Set(['Especiais', 'Estádios']);

const StatsScreen = () => {
  const insets = useSafeAreaInsets();
  const { stickers } = useStickersStore();
  const { userStickers } = useUserStickersStore();

  const stats = useMemo(() => {
    if (!stickers.length) return null;

    const ownedMap = new Map<string, number>();
    userStickers.forEach((s) => ownedMap.set(s.sticker_code, s.quantity));

    const totalStickers = stickers.length;
    const ownedUniqueCount = stickers.filter((s) => ownedMap.has(s.code)).length;
    const albumProgress = (ownedUniqueCount / totalStickers) * 100;

    const totalShiny = stickers.filter((s) => s.is_shiny).length;
    const shinyOwned = stickers.filter((s) => s.is_shiny && ownedMap.has(s.code)).length;

    const totalDuplicateCopies = userStickers
      .filter((s) => s.quantity > 1)
      .reduce((acc, s) => acc + (s.quantity - 1), 0);

    const totalCopiesCollected = userStickers.reduce((acc, s) => acc + s.quantity, 0);

    const teamSectionStatsMap: Record<string, { total: number; owned: number }> = {};
    const allSectionStatsMap: Record<string, { total: number; owned: number }> = {};
    stickers.forEach((sticker) => {
      if (!allSectionStatsMap[sticker.section]) {
        allSectionStatsMap[sticker.section] = { total: 0, owned: 0 };
      }
      allSectionStatsMap[sticker.section].total++;
      if (ownedMap.has(sticker.code)) {
        allSectionStatsMap[sticker.section].owned++;
      }

      if (NON_TEAM_SECTIONS.has(sticker.section)) return;
      if (!teamSectionStatsMap[sticker.section]) {
        teamSectionStatsMap[sticker.section] = { total: 0, owned: 0 };
      }
      teamSectionStatsMap[sticker.section].total++;
      if (ownedMap.has(sticker.code)) {
        teamSectionStatsMap[sticker.section].owned++;
      }
    });

    const teamStats = Object.entries(teamSectionStatsMap)
      .map(([name, { total, owned }]) => ({
        name,
        total,
        owned,
        pct: total > 0 ? owned / total : 0,
        icon: SECTION_MAP[name]?.icon || '🏳️',
      }))
      .sort((a, b) => b.owned - a.owned);

    const allSectionStats = Object.entries(allSectionStatsMap)
      .map(([name, { total, owned }]) => ({
        name,
        total,
        owned,
        pct: total > 0 ? owned / total : 0,
        icon: SECTION_MAP[name]?.icon || '🏳️',
      }));

    const mostOwnedTeam = teamStats[0] ?? null;
    const leastOwnedTeam = teamStats.filter((t) => t.owned > 0).at(-1) ?? null;
    const top5Missing = [...allSectionStats]
      .sort((a, b) => (b.total - b.owned) - (a.total - a.owned))
      .slice(0, 5);
    const mostMissingTeam = top5Missing[0] ?? null;

    return {
      totalStickers,
      ownedUniqueCount,
      albumProgress,
      totalShiny,
      shinyOwned,
      totalDuplicateCopies,
      totalCopiesCollected,
      mostOwnedTeam,
      leastOwnedTeam,
      mostMissingTeam,
      top5Missing,
    };
  }, [stickers, userStickers]);

  const barColors = ['#facc15', '#94a3b8', '#b45309', '#60a5fa', '#a78bfa'];

  if (!stats) return null;

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <View className="px-4 py-6 border-b border-border/50">
        <Text className="text-3xl font-bold text-foreground">Estatísticas</Text>
        <Text className="text-muted-foreground text-sm mt-1">Seu progresso no Álbum Copa 2026</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-primary rounded-2xl p-5 mb-4">
          <Text
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 }}
          >
            PROGRESSO GERAL
          </Text>
          <View className="flex-row items-end justify-between mb-3">
            <Text style={{ fontSize: 56, fontWeight: '800', color: 'white', lineHeight: 60 }}>
              {stats.albumProgress.toFixed(1)}%
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 4 }}>
              {stats.ownedUniqueCount} / {stats.totalStickers}
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4 }}>
            <View
              style={{
                height: 8,
                width: `${Math.min(stats.albumProgress, 100)}%`,
                backgroundColor: 'white',
                borderRadius: 4,
              }}
            />
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 8 }}>
            {stats.totalStickers - stats.ownedUniqueCount} figurinhas faltando
          </Text>
        </View>

        <View className="flex-row gap-3 mb-3">
          <Card className="flex-1 bg-muted/40 rounded-2xl px-4 pt-4 pb-4 gap-1 border-0 shadow-none">
            <View className="flex-row items-center gap-2 mb-1">
              <Star size={15} color="#facc15" fill="#facc15" />
              <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Brilhantes</Text>
            </View>
            <Text className="text-foreground text-2xl font-bold">{stats.shinyOwned}</Text>
            <Text className="text-muted-foreground text-xs">de {stats.totalShiny} no álbum</Text>
          </Card>

          <Card className="flex-1 bg-muted/40 rounded-2xl px-4 pt-4 pb-4 gap-1 border-0 shadow-none">
            <View className="flex-row items-center gap-2 mb-1">
              <Copy size={15} className="text-muted-foreground" />
              <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Repetidas</Text>
            </View>
            <Text className="text-foreground text-2xl font-bold">{stats.totalDuplicateCopies}</Text>
            <Text className="text-muted-foreground text-xs">cópias excedentes</Text>
          </Card>
        </View>

        <View className="flex-row gap-3 mb-5">
          <Card className="flex-1 bg-muted/40 rounded-2xl px-4 pt-4 pb-4 gap-1 border-0 shadow-none">
            <View className="flex-row items-center gap-2 mb-1">
              <Layers size={15} className="text-muted-foreground" />
              <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total Coletado</Text>
            </View>
            <Text className="text-foreground text-2xl font-bold">{stats.totalCopiesCollected}</Text>
            <Text className="text-muted-foreground text-xs">figurinhas (com cópias)</Text>
          </Card>

          <Card className="flex-1 bg-muted/40 rounded-2xl px-4 pt-4 pb-4 gap-1 border-0 shadow-none">
            <View className="flex-row items-center gap-2 mb-1">
              <Award size={15} className="text-muted-foreground" />
              <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Falta Completar</Text>
            </View>
            {stats.mostMissingTeam ? (
              <>
                <Text className="text-foreground text-xl font-bold">
                  {stats.mostMissingTeam.icon} {stats.mostMissingTeam.total - stats.mostMissingTeam.owned}
                </Text>
                <Text className="text-muted-foreground text-xs" numberOfLines={1}>
                  {stats.mostMissingTeam.name}
                </Text>
              </>
            ) : (
              <Text className="text-foreground text-2xl font-bold">-</Text>
            )}
          </Card>
        </View>

        <Text className="text-foreground text-lg font-bold mb-3">Por Seleção</Text>

        <View className="flex-row gap-3 mb-5">
          <Card className="flex-1 bg-muted/40 rounded-2xl px-4 pt-4 pb-4 gap-0 border-0 shadow-none">
            <View className="flex-row items-center gap-1.5 mb-3">
              <TrendingUp size={14} color="#22c55e" />
              <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Mais Figurinhas
              </Text>
            </View>
            {stats.mostOwnedTeam ? (
              <>
                <Text style={{ fontSize: 30, lineHeight: 40 }}>{stats.mostOwnedTeam.icon}</Text>
                <Text className="text-foreground font-bold text-sm mt-1" numberOfLines={1}>
                  {stats.mostOwnedTeam.name}
                </Text>
                <Text style={{ color: '#22c55e', fontSize: 22, fontWeight: '800' }}>
                  {stats.mostOwnedTeam.owned}
                </Text>
                <Text className="text-muted-foreground text-xs">de {stats.mostOwnedTeam.total}</Text>
              </>
            ) : (
              <Text className="text-muted-foreground text-sm">Nenhuma figurinha</Text>
            )}
          </Card>

          <Card className="flex-1 bg-muted/40 rounded-2xl px-4 pt-4 pb-4 gap-0 border-0 shadow-none">
            <View className="flex-row items-center gap-1.5 mb-3">
              <TrendingDown size={14} color="#f87171" />
              <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Menos Figurinhas
              </Text>
            </View>
            {stats.leastOwnedTeam ? (
              <>
                <Text style={{ fontSize: 30, lineHeight: 40 }}>{stats.leastOwnedTeam.icon}</Text>
                <Text className="text-foreground font-bold text-sm mt-1" numberOfLines={1}>
                  {stats.leastOwnedTeam.name}
                </Text>
                <Text style={{ color: '#f87171', fontSize: 22, fontWeight: '800' }}>
                  {stats.leastOwnedTeam.owned}
                </Text>
                <Text className="text-muted-foreground text-xs">de {stats.leastOwnedTeam.total}</Text>
              </>
            ) : (
              <Text className="text-muted-foreground text-sm">Nenhuma figurinha</Text>
            )}
          </Card>
        </View>

        <Text className="text-foreground text-lg font-bold mb-3">Faltam Mais Figurinhas</Text>
        <Card className="bg-muted/40 rounded-2xl px-4 pt-4 pb-4 gap-4 border-0 shadow-none">
          {stats.top5Missing.map((team, index) => {
            const missing = team.total - team.owned;
            const ownedPct = team.total > 0 ? team.owned / team.total : 0;
            return (
              <View key={team.name}>
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-2 flex-1 mr-2">
                    <Text className="text-muted-foreground text-xs w-3">{index + 1}.</Text>
                    <Text style={{ fontSize: 15, lineHeight: 20 }}>{team.icon}</Text>
                    <Text className="text-foreground text-sm font-medium flex-1" numberOfLines={1}>
                      {team.name}
                    </Text>
                  </View>
                  <Text className="text-muted-foreground text-xs">
                    faltam {missing}
                  </Text>
                </View>
                <View style={{ height: 5, backgroundColor: 'rgba(128,128,128,0.2)', borderRadius: 3 }}>
                  <View
                    style={{
                      height: 5,
                      width: `${ownedPct * 100}%`,
                      borderRadius: 3,
                      backgroundColor: barColors[index],
                    }}
                  />
                </View>
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </View>
  );
};

export default StatsScreen;

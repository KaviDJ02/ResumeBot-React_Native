import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { auth } from '@/firebase';
import { renderAtsHtml, type CvData } from '@/resume/atsTemplate';
import { loadLocalCvData } from '@/resume/storage';

function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="rounded bg-black px-4 py-3 active:opacity-80">
      <Text className="text-center font-semibold text-white">{title}</Text>
    </Pressable>
  );
}

export default function ResumePreviewScreen() {
  const params = useLocalSearchParams<{ template?: string }>();
  const template = params.template ?? 'ats';

  const [cv, setCv] = useState<CvData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await loadLocalCvData(auth.currentUser?.uid);
        if (!alive) return;
        setCv(data);
      } catch (e) {
        Alert.alert('Could not load CV', e instanceof Error ? e.message : 'Unknown error.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const html = useMemo(() => {
    if (!cv) return '<html><body>Loading…</body></html>';
    if (template === 'ats') return renderAtsHtml(cv);
    return renderAtsHtml(cv);
  }, [cv, template]);

  async function onDownloadPdf() {
    if (downloading) return;
    setDownloading(true);
    try {
      const file = await Print.printToFileAsync({ html, base64: false });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing not available', `PDF saved at: ${file.uri}`);
        return;
      }
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Download Resume PDF',
        UTI: 'com.adobe.pdf',
      });
    } catch (e) {
      Alert.alert('Download failed', e instanceof Error ? e.message : 'Unknown error.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      <View className="px-5 pb-3 pt-2">
        <Text className="text-2xl font-semibold">CV Template</Text>
        <Text className="mt-1 text-sm text-gray-600">
          {template === 'ats' ? 'ATS Simple' : template}
        </Text>
      </View>

      <View className="px-5 pb-3">
        <PrimaryButton title={downloading ? 'Downloading…' : 'Download PDF'} onPress={onDownloadPdf} />
        {loading ? <Text className="mt-2 text-sm text-gray-600">Loading…</Text> : null}
      </View>

      <View className="flex-1">
        <WebView originWhitelist={['*']} source={{ html }} />
      </View>
    </SafeAreaView>
  );
}

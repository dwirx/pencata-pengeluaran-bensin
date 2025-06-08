"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, X, Smartphone, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show our custom install prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000); // Show after 5 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  // Don't show if not mounted, already installed or dismissed this session
  if (!isMounted || isInstalled || 
      (typeof window !== 'undefined' && sessionStorage.getItem('pwa-install-dismissed') === 'true') ||
      !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:max-w-sm">
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <Smartphone className="h-4 w-4 text-green-600" />
              </div>
              <CardTitle className="text-sm font-semibold">Install Eco-fuel</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Install aplikasi ke perangkat Anda untuk akses cepat dan pengalaman yang lebih baik!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <Monitor className="h-3 w-3" />
              <span>Offline ready</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <Download className="h-3 w-3" />
              <span>Fast loading</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleInstallClick}
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-3 w-3 mr-2" />
              Install App
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDismiss}
              className="text-gray-600"
            >
              Nanti
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// iOS specific install instructions component
export function IOSInstallInstructions() {
  const [showIOS, setShowIOS] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInWebAppiOS = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // Show iOS instructions if on iOS, not installed, and not dismissed
    if (isIOS && !isInWebAppiOS && !isStandalone && 
        typeof window !== 'undefined' && !sessionStorage.getItem('ios-install-dismissed')) {
      setTimeout(() => setShowIOS(true), 8000); // Show after install prompt
    }
  }, []);

  if (!isMounted || !showIOS) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-sm bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Install di iOS</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setShowIOS(false);
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('ios-install-dismissed', 'true');
                }
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Untuk install Eco-fuel di iPhone/iPad:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">1</div>
            <p className="text-sm">Tap tombol <strong>Share</strong> (□↗) di Safari</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">2</div>
            <p className="text-sm">Pilih <strong>&quot;Add to Home Screen&quot;</strong></p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">3</div>
            <p className="text-sm">Tap <strong>&quot;Add&quot;</strong> untuk install</p>
          </div>
          
          <Button 
            onClick={() => {
              setShowIOS(false);
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('ios-install-dismissed', 'true');
              }
            }}
            className="w-full mt-4"
          >
            Mengerti
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CreditCard,
  Banknote,
  Save,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import Loading from "@/components/global/ui/Loading";

interface PaymentMethod {
  id: number;
  method_name: string;
  method_name_ar: string;
  is_enabled: boolean;
  settings: {
    [key: string]: any;
  };
}

export default function PaymentSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("payment_settings")
        .select("*")
        .order("id");

      if (error) throw error;

      setPaymentMethods(data || []);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("حدث خطأ في تحميل بيانات وسائل الدفع");
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentMethod = async (id: number, currentStatus: boolean) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("payment_settings")
        .update({
          is_enabled: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setPaymentMethods((prev) =>
        prev.map((method) =>
          method.id === id ? { ...method, is_enabled: !currentStatus } : method
        )
      );

      toast.success(
        `تم ${!currentStatus ? "تفعيل" : "إلغاء تفعيل"} وسيلة الدفع بنجاح`
      );
    } catch (error) {
      console.error("Error toggling payment method:", error);
      toast.error("حدث خطأ في تحديث وسيلة الدفع");
    } finally {
      setSaving(false);
    }
  };

  const updatePaymentSettings = async (id: number, newSettings: any) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("payment_settings")
        .update({
          settings: newSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setPaymentMethods((prev) =>
        prev.map((method) =>
          method.id === id ? { ...method, settings: newSettings } : method
        )
      );

      toast.success("تم تحديث إعدادات الدفع بنجاح");
    } catch (error) {
      console.error("Error updating payment settings:", error);
      toast.error("حدث خطأ في تحديث الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            إعدادات وسائل الدفع المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">معلومات مهمة</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• يمكن تفعيل أكثر من وسيلة دفع في نفس الوقت</li>
              <li>• العملاء سيتمكنون من الاختيار بين الوسائل المفعلة فقط</li>
              <li>• تأكد من صحة بيانات كاشير قبل تفعيل الدفع الإلكتروني</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paymentMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            onToggle={togglePaymentMethod}
            onUpdateSettings={updatePaymentSettings}
            saving={saving}
            showApiKeys={showApiKeys}
          />
        ))}
      </div>

      {/* API Keys Visibility Toggle */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setShowApiKeys(!showApiKeys)}
          className="flex items-center gap-2"
        >
          {showApiKeys ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {showApiKeys ? "إخفاء المفاتيح السرية" : "إظهار المفاتيح السرية"}
        </Button>
      </div>
    </div>
  );
}

// Individual Payment Method Card
interface PaymentMethodCardProps {
  method: PaymentMethod;
  onToggle: (id: number, currentStatus: boolean) => void;
  onUpdateSettings: (id: number, settings: any) => void;
  saving: boolean;
  showApiKeys: boolean;
}

function PaymentMethodCard({
  method,
  onToggle,
  onUpdateSettings,
  saving,
  showApiKeys,
}: PaymentMethodCardProps) {
  const [settings, setSettings] = useState(method.settings);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdateSettings(method.id, settings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSettings(method.settings);
    setIsEditing(false);
  };

  const isCashOnDelivery = method.method_name === "cash_on_delivery";
  const isKashier = method.method_name === "kashier_visa";

  return (
    <Card
      className={`transition-all duration-200 ${
        method.is_enabled
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCashOnDelivery ? (
              <Banknote className="w-5 h-5 text-green-600" />
            ) : (
              <CreditCard className="w-5 h-5 text-blue-600" />
            )}
            <span>{method.method_name_ar}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                method.is_enabled
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {method.is_enabled ? "مُفعل" : "معطل"}
            </span>
            <Button
              variant={method.is_enabled ? "destructive" : "default"}
              size="sm"
              onClick={() => onToggle(method.id, method.is_enabled)}
              disabled={saving}
            >
              {method.is_enabled ? "إلغاء تفعيل" : "تفعيل"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cash on Delivery Settings */}
        {isCashOnDelivery && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {settings.description || "الدفع نقداً عند استلام الطلب"}
            </p>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label>الوصف</Label>
                  <Input
                    value={settings.description || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, description: e.target.value })
                    }
                    placeholder="وصف وسيلة الدفع"
                  />
                </div>
                <div>
                  <Label>رسوم إضافية (جنيه)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.fee || 0}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        fee: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving} size="sm">
                    <Save className="w-3 h-3 mr-1" />
                    حفظ
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <span className="text-lg font-bold text-green-600">
                    رسوم إضافية: {settings.fee || 0} جنيه
                  </span>
                </div>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  تعديل الإعدادات
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Kashier Visa Settings */}
        {isKashier && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              الدفع الإلكتروني عبر بوابة كاشير - فيزا وماستركارد
            </p>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label className="mb-2">معرف التاجر (Merchant ID)</Label>
                  <Input
                    value={settings.merchant_id || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, merchant_id: e.target.value })
                    }
                    placeholder="MID-xxx-xxx"
                  />
                </div>
                <div>
                  <Label className="mb-2">مفتاح API</Label>
                  <Input
                    type={showApiKeys ? "text" : "password"}
                    value={settings.api_key || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, api_key: e.target.value })
                    }
                    placeholder="API Key من كاشير"
                  />
                </div>
                <div>
                  <Label className="mb-2">
                    مفتاح الإطار المدمج (iFrame Key)
                  </Label>
                  <Input
                    type={showApiKeys ? "text" : "password"}
                    value={settings.iframe_key || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, iframe_key: e.target.value })
                    }
                    placeholder="iFrame Key من كاشير"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="test_mode"
                    checked={settings.test_mode || false}
                    onChange={(e) =>
                      setSettings({ ...settings, test_mode: e.target.checked })
                    }
                  />
                  <Label htmlFor="test_mode">وضع التجربة (Test Mode)</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving} size="sm">
                    <Save className="w-3 h-3 mr-1" />
                    حفظ
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="bg-white p-3 rounded-lg border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">معرف التاجر:</span>
                    <span className="font-mono">
                      {settings.merchant_id
                        ? showApiKeys
                          ? settings.merchant_id
                          : "●●●●●●●●"
                        : "غير محدد"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الحالة:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        settings.test_mode
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {settings.test_mode ? "وضع التجربة" : "وضع الإنتاج"}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  تعديل إعدادات كاشير
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

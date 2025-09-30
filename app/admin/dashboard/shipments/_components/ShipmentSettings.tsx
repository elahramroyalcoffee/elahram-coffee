"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Truck, MapPin, DollarSign, Save, RefreshCw } from "lucide-react";
import Loading from "@/components/global/ui/Loading";

interface Shipment {
  id: number;
  governorate_name: string;
  governorate_name_ar: string;
  price: number;
  is_active: boolean;
}

export default function ShipmentSettings() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [globalPrice, setGlobalPrice] = useState<string>("");
  const [showGlobalUpdate, setShowGlobalUpdate] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .order("governorate_name_ar");

      if (error) throw error;

      setShipments(data || []);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast.error("حدث خطأ في تحميل بيانات الشحن");
    } finally {
      setLoading(false);
    }
  };

  const updateShipmentPrice = async (id: number, newPrice: number) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("shipments")
        .update({
          price: newPrice,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setShipments((prev) =>
        prev.map((shipment) =>
          shipment.id === id ? { ...shipment, price: newPrice } : shipment
        )
      );

      toast.success("تم تحديث سعر الشحن بنجاح");
    } catch (error) {
      console.error("Error updating shipment price:", error);
      toast.error("حدث خطأ في تحديث سعر الشحن");
    } finally {
      setSaving(false);
    }
  };

  const updateAllPrices = async () => {
    if (!globalPrice || parseFloat(globalPrice) < 0) {
      toast.error("يرجى إدخال سعر صحيح");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("shipments")
        .update({
          price: parseFloat(globalPrice),
          updated_at: new Date().toISOString(),
        })
        .neq("id", 0); // Update all records

      if (error) throw error;

      // Update local state
      setShipments((prev) =>
        prev.map((shipment) => ({
          ...shipment,
          price: parseFloat(globalPrice),
        }))
      );

      setGlobalPrice("");
      setShowGlobalUpdate(false);
      toast.success("تم تحديث جميع أسعار الشحن بنجاح");
    } catch (error) {
      console.error("Error updating all prices:", error);
      toast.error("حدث خطأ في تحديث الأسعار");
    } finally {
      setSaving(false);
    }
  };

  const toggleShipmentStatus = async (id: number, currentStatus: boolean) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("shipments")
        .update({
          is_active: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setShipments((prev) =>
        prev.map((shipment) =>
          shipment.id === id
            ? { ...shipment, is_active: !currentStatus }
            : shipment
        )
      );

      toast.success(`تم ${!currentStatus ? "تفعيل" : "إلغاء"} الشحن بنجاح`);
    } catch (error) {
      console.error("Error toggling shipment status:", error);
      toast.error("حدث خطأ في تحديث حالة الشحن");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            إعدادات الشحن والتوصيل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setShowGlobalUpdate(!showGlobalUpdate)}
              className="flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              تحديث جميع الأسعار
            </Button>

            <Button
              variant="outline"
              onClick={fetchShipments}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              تحديث البيانات
            </Button>
          </div>

          {/* Global Price Update Section */}
          {showGlobalUpdate && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">
                تحديث جميع أسعار الشحن
              </h3>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Label htmlFor="globalPrice">
                    السعر الجديد لجميع المحافظات (جنيه)
                  </Label>
                  <Input
                    id="globalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={globalPrice}
                    onChange={(e) => setGlobalPrice(e.target.value)}
                    placeholder="مثال: 50.00"
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={updateAllPrices}
                  disabled={saving || !globalPrice}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  تحديث الكل
                </Button>
              </div>
              <p className="text-sm text-blue-700 mt-2">
                ⚠️ سيتم تحديث جميع أسعار الشحن لكل المحافظات بنفس السعر
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shipments.map((shipment) => (
          <ShipmentCard
            key={shipment.id}
            shipment={shipment}
            onUpdatePrice={updateShipmentPrice}
            onToggleStatus={toggleShipmentStatus}
            saving={saving}
          />
        ))}
      </div>
    </div>
  );
}

// Individual Shipment Card Component
interface ShipmentCardProps {
  shipment: Shipment;
  onUpdatePrice: (id: number, price: number) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  saving: boolean;
}

function ShipmentCard({
  shipment,
  onUpdatePrice,
  onToggleStatus,
  saving,
}: ShipmentCardProps) {
  const [price, setPrice] = useState(shipment.price.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const newPrice = parseFloat(price);
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error("يرجى إدخال سعر صحيح");
      return;
    }

    onUpdatePrice(shipment.id, newPrice);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPrice(shipment.price.toString());
    setIsEditing(false);
  };

  return (
    <Card
      className={`transition-all duration-200 ${
        shipment.is_active
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{shipment.governorate_name_ar}</span>
          </div>
          <Button
            variant={shipment.is_active ? "destructive" : "default"}
            size="sm"
            onClick={() => onToggleStatus(shipment.id, shipment.is_active)}
            disabled={saving}
            className="text-xs"
          >
            {shipment.is_active ? "إلغاء" : "تفعيل"}
          </Button>
        </CardTitle>
        <p className="text-sm text-gray-600">{shipment.governorate_name}</p>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">سعر الشحن</Label>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                shipment.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {shipment.is_active ? "مُفعل" : "معطل"}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="text-center"
                placeholder="السعر بالجنيه"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  size="sm"
                  className="flex-1"
                >
                  <Save className="w-3 h-3 mr-1" />
                  حفظ
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-center p-3 bg-white rounded-lg border">
                <span className="text-2xl font-bold text-green-600">
                  {shipment.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 mr-1">جنيه</span>
              </div>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={!shipment.is_active}
              >
                تعديل السعر
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

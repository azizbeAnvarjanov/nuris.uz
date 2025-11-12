import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface AdminPageProps {
  onBack: () => void;
}

export function AdminPage({ onBack }: AdminPageProps) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    date: "",
    time: "",
    description: "",
    point1: "",
    point2: "",
    point3: "",
    buttonText: "",
    telegramLink: "",
    giftTitle: "",
    giftDescription: "",
    countdownMinutes: 2,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9d7867d5/masterclass-data`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          date: data.date || "",
          time: data.time || "",
          description: data.description || "",
          point1: data.points[0] || "",
          point2: data.points[1] || "",
          point3: data.points[2] || "",
          buttonText: data.buttonText || "",
          telegramLink: data.telegramLink || "",
          giftTitle: data.giftTitle || "",
          giftDescription: data.giftDescription || "",
          countdownMinutes: data.countdownMinutes || 2,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9d7867d5/masterclass-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            title: formData.title,
            subtitle: formData.subtitle,
            date: formData.date,
            time: formData.time,
            description: formData.description,
            points: [formData.point1, formData.point2, formData.point3],
            buttonText: formData.buttonText,
            telegramLink: formData.telegramLink,
            giftTitle: formData.giftTitle,
            giftDescription: formData.giftDescription,
            countdownMinutes: formData.countdownMinutes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Saqlashda xatolik");
      }

      setMessage("Ma'lumotlar muvaffaqiyatli saqlandi!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Orqaga
            </Button>
            <h1>Admin Panel - Masterclass Ma'lumotlari</h1>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.includes("muvaffaqiyatli")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Sarlavha</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="BEPUL ONLINE MASTERCLASS"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Qo'shimcha sarlavha</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="«SO'ROVNOMA TUZISH VA NATIJALARNI TAHLIL QILISH»"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Sana</Label>
                  <Input
                    id="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    placeholder="12-noyabr"
                  />
                </div>

                <div>
                  <Label htmlFor="time">Vaqt</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    placeholder="19:00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Tavsif</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Masterclass haqida qisqacha ma'lumot"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label>Asosiy fikrlar</Label>
                <div>
                  <Input
                    value={formData.point1}
                    onChange={(e) =>
                      setFormData({ ...formData, point1: e.target.value })
                    }
                    placeholder="Birinchi fikr"
                    className="mb-2"
                  />
                  <Input
                    value={formData.point2}
                    onChange={(e) =>
                      setFormData({ ...formData, point2: e.target.value })
                    }
                    placeholder="Ikkinchi fikr"
                    className="mb-2"
                  />
                  <Input
                    value={formData.point3}
                    onChange={(e) =>
                      setFormData({ ...formData, point3: e.target.value })
                    }
                    placeholder="Uchinchi fikr"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="buttonText">Tugma matni</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) =>
                    setFormData({ ...formData, buttonText: e.target.value })
                  }
                  placeholder="BEPUL QATNASHISH"
                />
              </div>

              <div>
                <Label htmlFor="telegramLink">Telegram havolasi</Label>
                <Input
                  id="telegramLink"
                  type="url"
                  value={formData.telegramLink}
                  onChange={(e) =>
                    setFormData({ ...formData, telegramLink: e.target.value })
                  }
                  placeholder="https://t.me/..."
                />
              </div>

              <div>
                <Label htmlFor="giftTitle">Sovg'a sarlavhasi</Label>
                <Input
                  id="giftTitle"
                  value={formData.giftTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, giftTitle: e.target.value })
                  }
                  placeholder="ISHTIROKCHILARIMIZGA SOVG'A"
                />
              </div>

              <div>
                <Label htmlFor="giftDescription">Sovg'a tavsifi</Label>
                <Textarea
                  id="giftDescription"
                  value={formData.giftDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      giftDescription: e.target.value,
                    })
                  }
                  placeholder="Sovg'a haqida ma'lumot"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="countdownMinutes">
                  Orqaga sanash vaqti (daqiqa)
                </Label>
                <Input
                  id="countdownMinutes"
                  type="number"
                  min="1"
                  value={formData.countdownMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      countdownMinutes: parseInt(e.target.value) || 2,
                    })
                  }
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

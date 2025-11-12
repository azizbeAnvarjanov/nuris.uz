import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface MasterclassData {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  description: string;
  points: string[];
  buttonText: string;
  telegramLink: string;
  giftTitle: string;
  giftDescription: string;
  countdownMinutes: number;
}

interface LandingPageProps {
  onAdminClick: () => void;
}

export function LandingPage({ onAdminClick }: LandingPageProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState<MasterclassData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch masterclass data
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

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result);
      setTimeLeft(result.countdownMinutes * 60);
    } catch (error) {
      console.error("Error fetching masterclass data:", error);
      // Set default data
      setData({
        title: "BEPUL ONLINE MASTERCLASS",
        subtitle: "«SO'ROVNOMA TUZISH VA NATIJALARNI TAHLIL QILISH»",
        date: "12-noyabr",
        time: "19:00",
        description:
          "Ozbekistonda birinchi marta marketing va biznes sohasi bo'yicha marketing hamjamiyati tomonidan tashkil etilayotgan bepul online masterclass!",
        points: [
          "So'rovnoma turlari va ularning afzalliklari hamda kamchiliklari haqida bilib olasiz",
          "So'rovnomani qanday tuzish va qayerda e'lon qilish haqida ma'lumot olasiz",
          "So'rovnoma natijalarini tahlil qilish va ulardan qanday foydalanish haqida bilib olasiz",
        ],
        buttonText: "BEPUL QATNASHISH",
        telegramLink: "https://t.me/",
        giftTitle: "ISHTIROKCHILARIMIZGA SOVG'A",
        giftDescription:
          "Masterklassda qatnashgan barcha ishtirokchilar uchun qo'shimcha bonuslar va materiallar taqdim etiladi!",
        countdownMinutes: 2,
      });
      setTimeLeft(2 * 60);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer logic
  useEffect(() => {
    if (!isActive || timeLeft === null || timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStartCountdown = () => {
    if (!isActive) {
      setIsActive(true);
      if (data) {
        setTimeLeft(data.countdownMinutes * 60);
      }
    }
  };

  const handleButtonClick = () => {
    if (data?.telegramLink) {
      window.open(data.telegramLink, "_blank");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500">
        <div className="text-white">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500">
        <div className="text-white">Ma'lumot topilmadi</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Content Card */}
        <div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={handleStartCountdown}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Column */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 md:p-12 text-white">
              <div className="space-y-6">
                <div>
                  <h1 className="mb-2">{data.title}</h1>
                  <h2 className="text-xl opacity-90">{data.subtitle}</h2>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="opacity-80">Kun</div>
                    <div>{data.date}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="opacity-80">Soat</div>
                    <div>{data.time}</div>
                  </div>
                </div>

                <p className="opacity-90 leading-relaxed">{data.description}</p>

                {/* Countdown Timer */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="opacity-80 mb-2">Qolgan vaqt</div>
                  <div className="text-5xl tabular-nums tracking-wider">
                    {timeLeft !== null ? formatTime(timeLeft) : "02:00"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="p-8 md:p-12 bg-white">
              <div className="space-y-8">
                <div>
                  <h3 className="text-purple-600 mb-6">MASTERKLASSDA SIZ:</h3>
                  <div className="space-y-6">
                    {data.points.map((point, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <p className="flex-1 text-gray-700">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick();
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                >
                  {data.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gift Section */}
        <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-purple-600 mb-3">{data.giftTitle}</h3>
              <p className="text-gray-700">{data.giftDescription}</p>
            </div>
          </div>
        </div>

        {/* Admin Link */}
        <div className="mt-4 text-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              onAdminClick();
            }}
            className="text-white/70 hover:text-white transition-colors text-sm underline cursor-pointer bg-transparent border-none"
          >
            Admin panel
          </button>
        </div>
      </div>
    </div>
  );
}

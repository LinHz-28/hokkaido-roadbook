"use client";

/* eslint-disable @next/next/no-img-element -- Local Wikimedia thumbnails are pre-sized and rendered inside fixed booklet frames. */

import {
  AirplaneTakeoff,
  ArrowLeft,
  ArrowRight,
  Bed,
  CalendarBlank,
  Camera,
  Car,
  Compass,
  ForkKnife,
  HandSwipeLeft,
  Info,
  MapPin,
  NavigationArrow,
  X,
} from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Stop = {
  time: string;
  title: string;
  detail: string;
};

type DayChapter = {
  kind: "day";
  id: string;
  nav: string;
  day: number;
  date: string;
  weekday: string;
  place: string;
  title: string;
  route: string;
  mood: string;
  drive: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  secondaryImage?: string;
  secondaryAlt?: string;
  stops: Stop[];
  meal: string;
  hotel: string;
  hotelNote: string;
};

type SimpleChapter = {
  kind: "cover" | "route";
  id: string;
  nav: string;
};

type Chapter = SimpleChapter | DayChapter;

const days: DayChapter[] = [
  {
    kind: "day",
    id: "day-1",
    nav: "D1",
    day: 1,
    date: "8 月 27 日",
    weekday: "星期四",
    place: "FURANO",
    title: "落地北海道，直抵富良野",
    route: "新千歲機場 → 富良野",
    mood: "越過城市與群山，旅程的第一頁在富良野暮色中展開。",
    drive: "主線車程約 2 小時",
    image: "/images/farm-tomita.jpg",
    imageAlt: "富田農場盛開的紫色薰衣草田",
    stops: [
      { time: "11:55", title: "抵達新千歲機場", detail: "完成入境手續後前往租車櫃檯。" },
      { time: "午後", title: "領車與 HEP Pass", detail: "確認 ETC 設備，並於櫃檯加購 HEP Pass。" },
      { time: "午後", title: "直接北上", detail: "上高速公路前往富良野，不繞路、不走回頭路。" },
      { time: "傍晚", title: "富良野入住", detail: "放下行李後，在山城暮色裡慢慢吃一頓晚餐。" },
    ],
    meal: "晚餐首選「唯我獨尊」歐風咖哩，也可在富良野市區品嚐和風料理。",
    hotel: "Nozo Hotel",
    hotelNote: "行事曆確認 / 富良野市北之峰町 14-38",
  },
  {
    kind: "day",
    id: "day-2",
    nav: "D2",
    day: 2,
    date: "8 月 28 日",
    weekday: "星期五",
    place: "BIEI / ASAHIKAWA",
    title: "花田、青池，一路向北",
    route: "富良野 → 美瑛 → 旭川",
    mood: "花色漸遠、池水轉藍，每一段短途車程都像翻開新的風景。",
    drive: "各段約 15 至 30 分鐘",
    image: "/images/blue-pond.jpg",
    imageAlt: "美瑛白金青池的湛藍湖水與枯木倒影",
    imagePosition: "center 54%",
    secondaryImage: "/images/shikisai-hill.jpg",
    secondaryAlt: "四季彩之丘層層延伸的繽紛花田",
    stops: [
      { time: "早晨", title: "富田農場", detail: "欣賞夏末花田，順手吃一支哈密瓜霜淇淋。" },
      { time: "中午", title: "四季彩之丘", detail: "從丘陵俯瞰層層展開的斑斕花毯。" },
      { time: "午後", title: "白金青池", detail: "探訪神祕的鈷藍色池水與枯木倒影。" },
      { time: "午後", title: "白鬚瀑布", detail: "沿溪谷看瀑布奔入美瑛川，再順向前往旭川。" },
    ],
    meal: "晚餐可選旭川拉麵，或到市區品嚐成吉思汗烤羊肉。",
    hotel: "Amanek Hotel Asahikawa",
    hotelNote: "行事曆確認 / 旭川站前 1 條通 8 丁目",
  },
  {
    kind: "day",
    id: "day-3",
    nav: "D3",
    day: 3,
    date: "8 月 29 日",
    weekday: "星期六",
    place: "ASAHIKAWA → WAKKANAI",
    title: "告別城市，奔向最北端",
    route: "旭川 → 國道 40 號 → 稚內",
    mood: "道路愈來愈筆直，文明的喧囂也在後視鏡裡逐漸消失。",
    drive: "午後主線約 3.5 至 4 小時",
    image: "/images/asahiyama-penguin.jpg",
    imageAlt: "旭山動物園內列隊散步的企鵝",
    imagePosition: "center 46%",
    stops: [
      { time: "09:30", title: "旭山動物園開園", detail: "先看企鵝、北極熊與北海道代表性動物。" },
      { time: "中午", title: "整備北上", detail: "離園後簡單用餐，補充飲水與車上零食。" },
      { time: "午後", title: "國道 40 號", detail: "專心駕駛筆直流暢的北上長路。" },
      { time: "傍晚", title: "抵達稚內", detail: "入住後步行探索車站周邊的海鮮居酒屋。" },
    ],
    meal: "晚餐探索稚內車站周邊海鮮居酒屋，今天適合早點休息。",
    hotel: "Dormy Inn Wakkanai",
    hotelNote: "三晚連住第 1 晚 / 天然溫泉「天北之湯」",
  },
  {
    kind: "day",
    id: "day-4",
    nav: "D4",
    day: 4,
    date: "8 月 30 日",
    weekday: "星期日",
    place: "SOYA",
    title: "宗谷岬與白色之道",
    route: "稚內 → 宗谷岬 → 宗谷丘陵 → 野寒布岬",
    mood: "白色道路伸向海天盡頭，世界在此只剩風、草原與寂靜。",
    drive: "最北端一日環線",
    image: "/images/white-shell-road.jpg",
    imageAlt: "宗谷丘陵蜿蜒向海的白色扇貝殼道路",
    imagePosition: "center 50%",
    secondaryImage: "/images/soya-cape.jpg",
    secondaryAlt: "宗谷岬日本最北端之地碑與北方海岸",
    stops: [
      { time: "早晨", title: "宗谷岬", detail: "朝聖日本最北端地碑，直面鄂霍次克海。" },
      { time: "中午", title: "宗谷丘陵", detail: "穿越開闊牧草地與起伏稜線。" },
      { time: "午後", title: "白色之道", detail: "駛入由扇貝殼鋪成的北境祕境道路。" },
      { time: "傍晚", title: "野寒布岬", detail: "吹海風、等日落，晴天可遠眺利尻富士。" },
    ],
    meal: "午餐可選帆立貝、章魚或海鮮丼，晚餐返回稚內市區。",
    hotel: "Dormy Inn Wakkanai",
    hotelNote: "三晚連住第 2 晚 / 免搬行李",
  },
  {
    kind: "day",
    id: "day-5",
    nav: "D5",
    day: 5,
    date: "8 月 31 日",
    weekday: "星期一",
    place: "WAKKANAI",
    title: "世界盡頭的悠閒午後",
    route: "稚內市區慢遊",
    mood: "不追趕景點的一天，才真正聽得見北境城市緩慢的呼吸。",
    drive: "市區短程移動",
    image: "/images/wakkanai-dome.jpg",
    imageAlt: "稚內港北防波堤穹頂綿延的古羅馬式拱柱",
    imagePosition: "center 58%",
    stops: [
      { time: "早晨", title: "北防波堤穹頂", detail: "在古羅馬般的拱柱光影裡慢慢拍照。" },
      { time: "中午", title: "最北端食堂", detail: "尋找在地海鮮與屬於稚內的味道。" },
      { time: "午後", title: "留白時間", detail: "自由散步、逛車站，或回到海邊吹風。" },
      { time: "晚上", title: "溫泉收尾", detail: "回飯店泡湯，把長途駕駛的疲勞放掉。" },
    ],
    meal: "推薦章魚涮涮鍋、宗谷黑牛，或一間沒有排隊人潮的在地海鮮食堂。",
    hotel: "Dormy Inn Wakkanai",
    hotelNote: "三晚連住第 3 晚 / 最後一晚",
  },
  {
    kind: "day",
    id: "day-6",
    nav: "D6",
    day: 6,
    date: "9 月 1 日",
    weekday: "星期二",
    place: "ORORON LINE",
    title: "沿著日本海一路南下",
    route: "稚內 → 留萌 → 小樽",
    mood: "海岸公路漫長得像一場電影，終點是小樽煤油燈下的復古夜色。",
    drive: "全日海岸公路",
    image: "/images/ororon-windfarm.jpg",
    imageAlt: "奧羅龍線道道 106 號旁一字排開的巨大風車",
    imagePosition: "center 47%",
    stops: [
      { time: "早晨", title: "駛上奧羅龍線", detail: "右側是日本海，左側是原野與巨大風車陣。" },
      { time: "中午", title: "留萌一帶休息", detail: "補充體力，也讓長途駕駛保留專注。" },
      { time: "傍晚", title: "抵達小樽", detail: "辦理入住後，步行前往歷史街區。" },
      { time: "入夜", title: "小樽運河", detail: "看暖色街燈與倉庫倒映在水面上。" },
    ],
    meal: "途中安排海景休息站簡餐，抵達小樽後再吃壽司或海鮮料理。",
    hotel: "Unwind Hotel & Bar Otaru",
    hotelNote: "行事曆確認 / 小樽市色內 1-8-25",
  },
  {
    kind: "day",
    id: "day-7",
    nav: "D7",
    day: 7,
    date: "9 月 2 日",
    weekday: "星期三",
    place: "OTARU → SAPPORO",
    title: "小樽晨味，札幌夜宴",
    route: "小樽 → 札幌",
    mood: "從港町的玻璃微光轉場到札幌霓虹，旅程正式進入城市篇章。",
    drive: "主線車程約 40 分鐘",
    image: "/images/otaru-canal.jpg",
    imageAlt: "暖色街燈倒映在夜晚的小樽運河",
    imagePosition: "center 52%",
    stops: [
      { time: "早晨", title: "三角市場", detail: "用一碗海鮮丼為小樽早晨開場。" },
      { time: "上午", title: "音樂盒堂與北一硝子", detail: "漫步歷史街區，挑選玻璃與音樂盒小物。" },
      { time: "午後", title: "前往札幌", detail: "短程自駕後入住新飯店，正式切換城市節奏。" },
      { time: "晚上", title: "薄野湯咖哩", detail: "可選 Suage+、GARAKU，或依現場排隊彈性調整。" },
    ],
    meal: "早上吃三角市場海鮮丼，晚上以札幌湯咖哩迎接城市篇章。",
    hotel: "Hotel Sosei Sapporo - MGallery Collection",
    hotelNote: "三晚連住第 1 晚 / 札幌 Factory 西館",
  },
  {
    kind: "day",
    id: "day-8",
    nav: "D8",
    day: 8,
    date: "9 月 3 日",
    weekday: "星期四",
    place: "TAKINO / KITAHIROSHIMA",
    title: "大師建築與血拼全開",
    route: "札幌 → 瀧野靈園 → 三井 Outlet → 札幌",
    mood: "上午沉入建築的寂靜，下午切換成滿載而歸的購物快感。",
    drive: "前往瀧野約 30 分鐘",
    image: "/images/hill-of-buddha.jpg",
    imageAlt: "瀧野靈園薰衣草丘中的安藤忠雄頭大佛",
    imagePosition: "center 46%",
    stops: [
      { time: "早晨", title: "頭大佛殿", detail: "走入安藤忠雄設計的圓丘與寂靜軸線。" },
      { time: "上午", title: "巨石陣與摩艾", detail: "沿瀧野靈園順遊大型戶外景觀。" },
      { time: "中午", title: "三井 Outlet", detail: "前往札幌北廣島，先用餐再開始採買。" },
      { time: "下午", title: "血拼模式", detail: "New Balance、Asics 與日系品牌，戰利品直接放後車廂。" },
    ],
    meal: "午餐在 Outlet 內解決，晚餐回薄野吃「達摩」成吉思汗烤羊肉。",
    hotel: "Hotel Sosei Sapporo - MGallery Collection",
    hotelNote: "三晚連住第 2 晚 / 戰利品集中整理",
  },
  {
    kind: "day",
    id: "day-9",
    nav: "D9",
    day: 9,
    date: "9 月 4 日",
    weekday: "星期五",
    place: "SAPPORO",
    title: "札幌經典與百萬夜景",
    route: "白色戀人公園 → 啤酒博物館 → 狸小路 → 藻岩山",
    mood: "白日收藏城市經典，夜晚則把整座札幌的燈火收進眼底。",
    drive: "市區自駕後改搭大眾運輸",
    image: "/images/moiwa-night.jpg",
    imageAlt: "從藻岩山俯瞰札幌延伸至天際的萬家燈火",
    imagePosition: "center 54%",
    stops: [
      { time: "早晨", title: "白色戀人公園", detail: "走進歐式庭園，安排一份北海道甜點。" },
      { time: "中午", title: "札幌啤酒博物館", detail: "在紅磚老建築外拍照，感受工業歷史。" },
      { time: "午後", title: "狸小路補貨", detail: "先回飯店停車，再步行或搭地鐵採買藥妝。" },
      { time: "傍晚", title: "藻岩山", detail: "搭纜車登高，等待札幌萬家燈火亮起。" },
    ],
    meal: "白天安排甜點，晚餐回狸小路或薄野自由探索。",
    hotel: "Hotel Sosei Sapporo - MGallery Collection",
    hotelNote: "三晚連住第 3 晚 / 盤點、休息、打包",
  },
  {
    kind: "day",
    id: "day-10",
    nav: "D10",
    day: 10,
    date: "9 月 5 日",
    weekday: "星期六",
    place: "NEW CHITOSE",
    title: "最後巡禮，帶著北國返程",
    route: "札幌 → 新千歲機場 → 台灣",
    mood: "行李裝滿戰利品，心裡則留著一路向北、再沿海而返的遼闊風景。",
    drive: "前往機場約 1 小時",
    image: "/images/shikisai-hill.jpg",
    imageAlt: "四季彩之丘層層延伸的繽紛花田，作為北海道旅程回望",
    imagePosition: "center 52%",
    stops: [
      { time: "09:30", title: "札幌退房", detail: "確認行李與戰利品，開車前往新千歲機場。" },
      { time: "11:00 前", title: "完成還車", detail: "預留加油、檢查車況與接駁時間。" },
      { time: "中午", title: "機場最後採買", detail: "美食街午餐，或到 Royce’ Chocolate World 補伴手禮。" },
      { time: "13:00", title: "搭機返台", detail: "結束 10 天 9 夜的北海道順向縱走。" },
    ],
    meal: "在機場 3 樓美食街享用北海道最後一餐，再完成伴手禮採買。",
    hotel: "返程日",
    hotelNote: "13:00 航班 / 請依航空公司最終通知為準",
  },
];

const chapters: Chapter[] = [
  { kind: "cover", id: "cover", nav: "封面" },
  { kind: "route", id: "route", nav: "路線" },
  ...days,
];

const hotelLedger = [
  { date: "8/27", city: "富良野", hotel: "Nozo Hotel" },
  { date: "8/28", city: "旭川", hotel: "Amanek Hotel Asahikawa" },
  { date: "8/29-8/31", city: "稚內", hotel: "Dormy Inn Wakkanai" },
  { date: "9/1", city: "小樽", hotel: "Unwind Hotel & Bar Otaru" },
  { date: "9/2-9/4", city: "札幌", hotel: "Hotel Sosei Sapporo - MGallery Collection" },
];

const photoCredits = [
  { place: "富田農場", author: "Douglas Perkins", license: "CC BY 4.0", licenseHref: "https://creativecommons.org/licenses/by/4.0/", href: "https://commons.wikimedia.org/wiki/File:Farm_Tomita_1.jpg" },
  { place: "四季彩之丘", author: "663highland", license: "CC BY 2.5", licenseHref: "https://creativecommons.org/licenses/by/2.5/", href: "https://commons.wikimedia.org/wiki/File:140726_Shikisai-no-oka_Biei_Hokkaido_Japan02n.jpg" },
  { place: "白金青池", author: "AndyLeungHK", license: "CC0", licenseHref: "https://creativecommons.org/publicdomain/zero/1.0/", href: "https://commons.wikimedia.org/wiki/File:Shirogane_Blue_Pond,_Biei,_Hokkaido_Japan.jpg" },
  { place: "旭山動物園", author: "欅（Keyaki）", license: "CC BY-SA 3.0", licenseHref: "https://creativecommons.org/licenses/by-sa/3.0/", href: "https://commons.wikimedia.org/wiki/File:Asahiyama_zoo_Penguin.jpg" },
  { place: "宗谷岬", author: "Suicasmo", license: "CC BY-SA 4.0", licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/", href: "https://commons.wikimedia.org/wiki/File:The_northernmost_point_of_Japan_monument_in_Soya_cape.jpg" },
  { place: "白色之道", author: "Yasu", license: "CC BY-SA 3.0", licenseHref: "https://creativecommons.org/licenses/by-sa/3.0/", href: "https://commons.wikimedia.org/wiki/File:Soya_Hills_White_Shell_Road.jpg" },
  { place: "北防波堤穹頂", author: "Suicasmo", license: "CC BY-SA 4.0", licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/", href: "https://commons.wikimedia.org/wiki/File:Wakkanai_Breakwater_Dome_20140813-2.jpg" },
  { place: "奧羅龍線", author: "Yasu", license: "CC BY-SA 3.0", licenseHref: "https://creativecommons.org/licenses/by-sa/3.0/", href: "https://commons.wikimedia.org/wiki/File:Otonrui_Wind_Farm_and_Hokkaido_Prefectural_Road_Route_106.jpg" },
  { place: "小樽運河", author: "Haha169", license: "CC BY-SA 4.0", licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/", href: "https://commons.wikimedia.org/wiki/File:Otaru_Canal_Night.jpg" },
  { place: "頭大佛", author: "MIKI Yoshihito", license: "CC BY 2.0", licenseHref: "https://creativecommons.org/licenses/by/2.0/", href: "https://commons.wikimedia.org/wiki/File:Hill_of_the_Buddha%2C_Makomanai_Takino_Cemetery_1_-_Jul_11%2C_2020.jpg" },
  { place: "藻岩山夜景", author: "掬茶", license: "CC BY-SA 4.0", licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/", href: "https://commons.wikimedia.org/wiki/File:City_nightscape_of_Sapporo_from_Mt._Moiwa_20260703a.jpg" },
];

function clampIndex(index: number) {
  return Math.max(0, Math.min(chapters.length - 1, index));
}

function chapterTitle(chapter: Chapter) {
  if (chapter.kind === "day") return `第 ${chapter.day} 天，${chapter.title}`;
  if (chapter.kind === "cover") return "極境孤寂・順向縱走與血拼";
  return "一路向北，再沿海折返";
}

function chapterImages(chapter: Chapter) {
  if (chapter.kind === "day") {
    return [chapter.image, chapter.secondaryImage].filter((image): image is string => Boolean(image));
  }
  if (chapter.kind === "cover") return ["/images/white-shell-road.jpg"];
  return ["/images/ororon-windfarm.jpg"];
}

export function TravelBook() {
  const reduceMotion = Boolean(useReducedMotion());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [turn, setTurn] = useState<{ from: number; to: number; direction: 1 | -1 } | null>(null);
  const [turnActive, setTurnActive] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const creditsDialogRef = useRef<HTMLDialogElement>(null);
  const navButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const gestureRef = useRef<{ x: number; y: number; time: number; pointerId: number } | null>(null);

  const goTo = useCallback((requestedIndex: number) => {
    const nextIndex = clampIndex(requestedIndex);
    if (nextIndex === currentIndex || turn) return;

    const distance = nextIndex - currentIndex;
    if (reduceMotion || Math.abs(distance) > 1) {
      setCurrentIndex(nextIndex);
      return;
    }

    setTurn({ from: currentIndex, to: nextIndex, direction: distance > 0 ? 1 : -1 });
  }, [currentIndex, reduceMotion, turn]);

  useEffect(() => {
    if (!turn) return;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setTurnActive(true));
    });
    const finishTimer = window.setTimeout(() => {
      setCurrentIndex(turn.to);
      setTurnActive(false);
      setTurn(null);
    }, 820);

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      window.clearTimeout(finishTimer);
    };
  }, [turn]);

  useEffect(() => {
    const requestedId = window.location.hash.replace("#", "");
    const requestedIndex = chapters.findIndex((chapter) => chapter.id === requestedId);
    if (requestedIndex < 0) return;
    const hashTimer = window.setTimeout(() => setCurrentIndex(requestedIndex), 0);
    return () => window.clearTimeout(hashTimer);
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", `#${chapters[currentIndex].id}`);
  }, [currentIndex]);

  useEffect(() => {
    const adjacent = [currentIndex - 1, currentIndex + 1]
      .filter((index) => index >= 0 && index < chapters.length)
      .flatMap((index) => chapterImages(chapters[index]));

    adjacent.forEach((source) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = source;
      void image.decode().catch(() => undefined);
    });
  }, [currentIndex]);

  useEffect(() => {
    navButtonRefs.current[currentIndex]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [currentIndex, reduceMotion]);

  useEffect(() => {
    const dialog = creditsDialogRef.current;
    if (!dialog) return;
    if (creditsOpen && !dialog.open) dialog.showModal();
    if (!creditsOpen && dialog.open) dialog.close();
  }, [creditsOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, a, [contenteditable='true']")) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(currentIndex + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(currentIndex - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(chapters.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, goTo]);

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    gestureRef.current = { x: event.clientX, y: event.clientY, time: performance.now(), pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const start = gestureRef.current;
    gestureRef.current = null;
    if (!start || start.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const elapsed = Math.max(1, performance.now() - start.time);
    const velocity = Math.abs(deltaX) / elapsed;
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
    const commits = Math.abs(deltaX) > 58 || (Math.abs(deltaX) > 20 && velocity > 0.45);

    if (isHorizontal && commits) {
      setShowSwipeHint(false);
      goTo(currentIndex + (deltaX < 0 ? 1 : -1));
    }
  };

  const current = chapters[currentIndex];
  const target = turn ? chapters[turn.to] : null;
  const from = turn ? chapters[turn.from] : null;

  return (
    <main className="travel-book-app">
      <div className="app-atmosphere" aria-hidden="true" />

      <header className="app-bar">
        <div className="brand-lockup">
          <Compass size={21} weight="duotone" aria-hidden="true" />
          <div>
            <strong>北海道極境縱走</strong>
            <span>2026.08.27 - 09.05</span>
          </div>
        </div>
        <div className="app-utilities">
          <span className="page-status">{current.nav} / 共 {chapters.length} 頁</span>
          <button className="utility-button" type="button" onClick={() => setCreditsOpen(true)}>
            <Info size={17} weight="bold" />
            照片授權
          </button>
        </div>
      </header>

      <div className="book-workspace">
        <button
          className="turn-control previous-control"
          type="button"
          aria-label="上一頁"
          disabled={currentIndex === 0 || Boolean(turn)}
          onClick={() => goTo(currentIndex - 1)}
        >
          <ArrowLeft size={23} weight="bold" />
        </button>

        <section
          className="book-stage"
          aria-label={`${chapterTitle(current)}，第 ${currentIndex + 1} 頁，共 ${chapters.length} 頁`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { gestureRef.current = null; }}
        >
          <div className="book-edge" aria-hidden="true" />
          <div className="static-page" aria-hidden={turn ? true : undefined} inert={Boolean(turn)}>
            <ChapterView
              chapter={target ?? current}
              interactive={!turn}
              onStart={() => goTo(1)}
              suffix="current"
            />
          </div>

          {turn && from && target ? (
            <div
              className={`turn-sheet ${turnActive ? "is-turning" : ""}`}
              data-direction={turn.direction === 1 ? "next" : "previous"}
              aria-hidden="true"
            >
              <div className="turn-face turn-front">
                <ChapterView chapter={from} interactive={false} onStart={() => undefined} suffix="front" />
              </div>
              <div className="turn-face turn-back">
                <ChapterView chapter={target} interactive={false} onStart={() => undefined} suffix="back" />
              </div>
              <div className="page-turn-shadow" aria-hidden="true" />
            </div>
          ) : null}

          {showSwipeHint ? (
            <div className="swipe-hint" aria-hidden="true">
              <HandSwipeLeft size={19} weight="duotone" />
              左右滑動翻頁
            </div>
          ) : null}
        </section>

        <button
          className="turn-control next-control"
          type="button"
          aria-label="下一頁"
          disabled={currentIndex === chapters.length - 1 || Boolean(turn)}
          onClick={() => goTo(currentIndex + 1)}
        >
          <ArrowRight size={23} weight="bold" />
        </button>
      </div>

      <nav className="chapter-nav" aria-label="行程日數">
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            ref={(element) => { navButtonRefs.current[index] = element; }}
            type="button"
            aria-current={index === currentIndex ? "page" : undefined}
            aria-label={`前往${chapterTitle(chapter)}`}
            onClick={() => goTo(index)}
          >
            {chapter.nav}
          </button>
        ))}
      </nav>

      <p className="sr-only" aria-live="polite">
        {chapterTitle(current)}，第 {currentIndex + 1} 頁，共 {chapters.length} 頁
      </p>

      <dialog
          ref={creditsDialogRef}
          className="credits-modal"
          aria-labelledby="credits-title"
          onClose={() => setCreditsOpen(false)}
          onCancel={() => setCreditsOpen(false)}
        >
          <section
            className="credits-dialog"
          >
            <header>
              <div>
                <Camera size={22} weight="duotone" />
                <h2 id="credits-title">真實照片來源</h2>
              </div>
              <button type="button" aria-label="關閉照片授權" onClick={() => setCreditsOpen(false)}>
                <X size={21} weight="bold" />
              </button>
            </header>
            <p>本手冊使用 Wikimedia Commons 的 1280px 開放授權縮圖。版面僅以 CSS 顯示裁切，正方形 favicon 由白色之道照片縮放製作。</p>
            <div className="credits-grid">
              {photoCredits.map((credit) => (
                <div className="credit-card" key={credit.place}>
                  <a className="credit-source" href={credit.href} target="_blank" rel="noreferrer">
                    <strong>{credit.place}</strong>
                    <span>Photo: {credit.author}</span>
                  </a>
                  <a className="credit-license" href={credit.licenseHref} target="_blank" rel="noreferrer">
                    {credit.license} 授權條款
                  </a>
                </div>
              ))}
            </div>
          </section>
      </dialog>
    </main>
  );
}

function ChapterView({
  chapter,
  interactive,
  onStart,
  suffix,
}: {
  chapter: Chapter;
  interactive: boolean;
  onStart: () => void;
  suffix: string;
}) {
  if (chapter.kind === "cover") {
    return <CoverChapter interactive={interactive} onStart={onStart} />;
  }
  if (chapter.kind === "route") {
    return <RouteChapter />;
  }
  if (chapter.kind === "day") {
    return <DayChapterPage day={chapter} suffix={suffix} />;
  }
  return null;
}

function CoverChapter({ interactive, onStart }: { interactive: boolean; onStart: () => void }) {
  return (
    <article className="chapter cover-chapter">
      <img
        className="cover-chapter-image"
        src="/images/white-shell-road.jpg"
        alt="宗谷丘陵蜿蜒向海的白色扇貝殼道路"
        draggable="false"
        loading="eager"
        fetchPriority="high"
      />
      <div className="cover-chapter-scrim" aria-hidden="true" />
      <div className="cover-chapter-copy">
        <p className="cover-label">HOKKAIDO / 2026</p>
        <h1 data-chapter-title>極境孤寂<br />順向縱走與血拼</h1>
        <p>從富良野一路向北至稚內，再沿日本海回到札幌。</p>
        {interactive ? (
          <button type="button" onClick={onStart}>
            開始旅程 <ArrowRight size={18} weight="bold" />
          </button>
        ) : (
          <span className="cover-faux-button">開始旅程 <ArrowRight size={18} weight="bold" /></span>
        )}
      </div>
      <div className="cover-corner" aria-hidden="true">
        <span>10 DAYS</span>
        <span>9 NIGHTS</span>
      </div>
    </article>
  );
}

function RouteChapter() {
  const routeStops = ["新千歲", "富良野", "美瑛", "旭川", "稚內", "留萌", "小樽", "札幌"];
  return (
    <article className="chapter route-chapter">
      <div className="route-visual">
        <img src="/images/ororon-windfarm.jpg" alt="奧羅龍線沿海原野與巨大風車陣" draggable="false" />
        <div className="route-photo-copy">
          <NavigationArrow size={30} weight="duotone" />
          <p>主線順向縱走</p>
          <strong>NORTHBOUND<br />THEN COASTAL SOUTH</strong>
        </div>
      </div>
      <div className="route-content chapter-scroll">
        <header>
          <p>ROUTE OVERVIEW</p>
          <h2 data-chapter-title>一路向北，再沿海折返</h2>
          <span>10 天主線不走回頭路，最長的駕駛日集中在旭川至稚內，以及奧羅龍海岸線。</span>
        </header>

        <div className="route-chain" aria-label="主要城市順序">
          {routeStops.map((stop, index) => (
            <div key={stop}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <strong>{stop}</strong>
            </div>
          ))}
        </div>

        <div className="trip-facts">
          <div><strong>10</strong><span>天</span></div>
          <div><strong>9</strong><span>夜</span></div>
          <div><strong>5</strong><span>間飯店</span></div>
          <div><strong>3 + 3</strong><span>兩段連住</span></div>
        </div>

        <section className="hotel-ledger" aria-labelledby="hotel-ledger-title">
          <div className="ledger-heading">
            <Bed size={20} weight="duotone" />
            <h3 id="hotel-ledger-title">行事曆確認住宿</h3>
          </div>
          <div className="ledger-grid">
            {hotelLedger.map((stay) => (
              <div key={`${stay.date}-${stay.city}`}>
                <time>{stay.date}</time>
                <span>{stay.city}</span>
                <strong>{stay.hotel}</strong>
              </div>
            ))}
          </div>
        </section>

        <p className="hep-reminder"><Info size={17} weight="fill" /> 領車時務必確認 HEP Pass 與 ETC 設備。</p>
      </div>
    </article>
  );
}

function DayChapterPage({ day, suffix }: { day: DayChapter; suffix: string }) {
  const titleId = `${day.id}-${suffix}-title`;
  return (
    <article className="chapter day-chapter" aria-labelledby={titleId}>
      <div className={`day-photo-panel ${day.secondaryImage ? "has-secondary" : ""}`}>
        <img
          className="day-main-photo"
          src={day.image}
          alt={day.imageAlt}
          style={{ objectPosition: day.imagePosition ?? "center" }}
          draggable="false"
          loading={day.day <= 2 ? "eager" : "lazy"}
        />
        {day.secondaryImage ? (
          <img className="day-secondary-photo" src={day.secondaryImage} alt={day.secondaryAlt ?? ""} draggable="false" loading="lazy" />
        ) : null}
        <div className="day-number" aria-hidden="true">{String(day.day).padStart(2, "0")}</div>
        <div className="photo-place" aria-hidden="true">{day.place}</div>
      </div>

      <div className="day-content chapter-scroll">
        <header className="day-heading">
          <div className="date-line">
            <CalendarBlank size={17} weight="duotone" />
            <time dateTime={`2026-${day.day <= 5 ? "08" : "09"}-${day.date.match(/\d+/g)?.at(-1)?.padStart(2, "0")}`}>
              {day.date} / {day.weekday}
            </time>
            <span><Car size={16} weight="duotone" /> {day.drive}</span>
          </div>
          <h2 id={titleId} data-chapter-title>{day.title}</h2>
          <p className="route-line"><MapPin size={17} weight="fill" /> {day.route}</p>
          <p className="mood-line">{day.mood}</p>
        </header>

        <ol className="day-timeline">
          {day.stops.map((stop) => (
            <li key={`${stop.time}-${stop.title}`}>
              <time>{stop.time}</time>
              <div>
                <strong>{stop.title}</strong>
                <p>{stop.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="day-bottom-grid">
          <section className="meal-note" aria-label="用餐提示">
            <ForkKnife size={20} weight="duotone" />
            <div><span>用餐提示</span><p>{day.meal}</p></div>
          </section>
          <section className="hotel-note" aria-label="住宿資訊">
            {day.day === 10 ? <AirplaneTakeoff size={21} weight="duotone" /> : <Bed size={21} weight="duotone" />}
            <div><span>{day.day === 10 ? "返程" : "今晚入住"}</span><strong>{day.hotel}</strong><small>{day.hotelNote}</small></div>
          </section>
        </div>
      </div>
    </article>
  );
}

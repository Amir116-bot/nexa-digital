import {
  Globe, Smartphone, Palette, PenLine, Search, Share2, Megaphone,
  Languages, Sparkles, Server, ShoppingCart, Wrench, Bot, type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Globe, Smartphone, Palette, PenLine, Search, Share2, Megaphone,
  Languages, Sparkles, Server, ShoppingCart, Wrench, Bot,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}

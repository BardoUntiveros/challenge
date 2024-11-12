const MAX_QUALITY = 50;
const MAX_QUALITY_SULFURAS = 80;
const MINIMUM_QUALITY = 0;

enum ItemType {
  AGED_BRIE = "Aged Brie",
  SULFURAS = "Sulfuras, Hand of Ragnaros",
  BACKSTAGE_PASS = "Backstage passes to a TAFKAL80ETC concert",
  CONJURED = "Conjured item",
}

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

interface ItemStrategy {
  update(item: Item): void;
}

class AgedBrieStrategy implements ItemStrategy {
  update(item: Item) {
    if (item.quality < MAX_QUALITY) {
      item.quality++;
    }
  }
}

class BackstagePassStrategy implements ItemStrategy {
  update(item: Item) {
    if (item.sellIn <= 0) {
      item.quality = MINIMUM_QUALITY;
    } else if (item.sellIn <= 5) {
      item.quality += 3;
    } else if (item.sellIn <= 10) {
      item.quality += 2;
    } else {
      item.quality++;
    }

    if (item.quality > MAX_QUALITY) {
      item.quality = MAX_QUALITY;
    }
  }
}

class SulfurasStrategy implements ItemStrategy {
  update(item: Item) {
    item.quality = MAX_QUALITY_SULFURAS;
  }
}

class ConjuredStrategy implements ItemStrategy {
  update(item: Item) {
    if (item.quality > MINIMUM_QUALITY) {
      item.quality -= 2;
    }
    if (item.sellIn < 0 && item.quality > MINIMUM_QUALITY) {
      item.quality -= 2;
    }

    if (item.quality < MINIMUM_QUALITY) {
      item.quality = MINIMUM_QUALITY;
    }
  }
}

class DefaultItemStrategy implements ItemStrategy {
  update(item: Item) {
    if (item.quality > MINIMUM_QUALITY) {
      item.quality--;
    }
    if (item.sellIn < 0 && item.quality > MINIMUM_QUALITY) {
      item.quality--;
    }

    if (item.quality < MINIMUM_QUALITY) {
      item.quality = MINIMUM_QUALITY;
    }
  }
}

class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    this.items.forEach((item) => {
      this._validateItemQuality(item);
      this._validateItemSellIn(item);

      const strategy = this._getItemStrategy(item);
      strategy.update(item);

      this._decreaseSellIn(item);
    });
    return this.items;
  }

  private _getItemStrategy(item: Item): ItemStrategy {
    switch (item.name) {
      case ItemType.AGED_BRIE:
        return new AgedBrieStrategy();
      case ItemType.BACKSTAGE_PASS:
        return new BackstagePassStrategy();
      case ItemType.SULFURAS:
        return new SulfurasStrategy();
      case ItemType.CONJURED:
        return new ConjuredStrategy();
      default:
        return new DefaultItemStrategy();
    }
  }

  private _validateItemQuality(item: Item): void {
    const maxQuality =
      item.name === ItemType.SULFURAS ? MAX_QUALITY_SULFURAS : MAX_QUALITY;

    if (item.quality < 0 || item.quality > maxQuality) {
      throw new Error(`Quality out of bounds for item: ${item.name}`);
    }
  }

  private _validateItemSellIn(item: Item): void {
    if (item.sellIn < 0) {
      throw new Error(`Invalid sellIn value for item: ${item.name}`);
    }
  }

  private _decreaseSellIn(item: Item): void {
    if (item.sellIn <= 0) return;
    if (item.name === ItemType.SULFURAS) {
      item.sellIn = 0; // Ideally, this should be "null" and validated not to be a number when instantiating the item, but we update it to 0 for the goblin's sake
    } else {
      item.sellIn--;
    }
  }
}

// Testing functionality...

const item1 = new Item(ItemType.AGED_BRIE, 2, 10);
const item2 = new Item(ItemType.SULFURAS, 4, 80);
const item3 = new Item(ItemType.BACKSTAGE_PASS, 6, 11);
const item4 = new Item(ItemType.CONJURED, 0, 12);

const gildedRose = new GildedRose([item1, item2, item3, item4]);

console.log("Previous items:");
console.log(gildedRose.items);

// Simulating 3 days has passed
gildedRose.updateQuality();
gildedRose.updateQuality();
gildedRose.updateQuality();

console.log("Updated items:");
console.log(gildedRose.items);

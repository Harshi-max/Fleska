export interface MenuItem {
  sku: string
  name: string
  price: number
  category?: string
}

export const getMenu = (): MenuItem[] => {
  return [
    {
      sku: 'JUMBO-WINGS',
      name: 'Jumbo Wings',
      price: 14.45,
      category: 'Appetizers'
    },
    {
      sku: 'BONELESS-WINGS',
      name: 'Boneless Chicken Wings',
      price: 12.25,
      category: 'Appetizers'
    },
    {
      sku: 'CRISPY-WINGS',
      name: 'Crispy Chicken Wings',
      price: 13.99,
      category: 'Appetizers'
    },
    {
      sku: 'CHICKEN-CHILLY',
      name: 'Chicken Chilly',
      price: 11.45,
      category: 'Main Course'
    },
    {
      sku: 'CHICKEN-65',
      name: 'Chicken 65',
      price: 10.35,
      category: 'Main Course'
    },
    {
      sku: 'CHICKEN-LOLLIPOP',
      name: 'Chicken Lollipop',
      price: 9.99,
      category: 'Main Course'
    },
    {
      sku: 'BUTTER-NAAN',
      name: 'Butter Naan',
      price: 3.50,
      category: 'Bread'
    },
    {
      sku: 'GARLIC-NAAN',
      name: 'Garlic Naan',
      price: 4.00,
      category: 'Bread'
    },
    {
      sku: 'BIRYANI-COMBO',
      name: 'Biryani Combo',
      price: 15.99,
      category: 'Rice Dishes'
    },
    {
      sku: 'MASALA-CHAI',
      name: 'Masala Chai',
      price: 2.50,
      category: 'Beverages'
    }
  ]
}

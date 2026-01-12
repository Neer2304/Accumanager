import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { ShoppingBag, Star } from '@mui/icons-material';
import ProductStatusChip from './ProductStatusChip';
import ProductStockBadge from './ProductStockBadge';
import ProductPriceDisplay from './ProductPriceDisplay';
import ProductActions from './ProductActions';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    discountPrice?: number;
    category: string;
    sku: string;
    stock: number;
    isActive: boolean;
    rating?: number;
    image?: string;
  };
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  variant?: 'grid' | 'list';
}

const ProductCards: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
  variant = 'grid',
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {product.image && (
        <CardMedia
          component="img"
          height={variant === 'grid' ? 200 : 150}
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" noWrap>
            {product.name}
          </Typography>
          <ProductStatusChip status={product.isActive ? 'active' : 'inactive'} size="small" />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description?.substring(0, 100)}...
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <ProductPriceDisplay
            price={product.price}
            discountPrice={product.discountPrice}
            size="medium"
            showCurrency
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip
            label={product.category}
            size="small"
            variant="outlined"
          />
          <ProductStockBadge stock={product.stock} size="small" />
        </Box>
        
        {product.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
            <Star sx={{ fontSize: 16, color: 'warning.main' }} />
            <Typography variant="body2" color="text.secondary">
              {product.rating.toFixed(1)}
            </Typography>
          </Box>
        )}
        
        <Typography variant="caption" color="text.secondary" fontFamily="monospace">
          SKU: {product.sku}
        </Typography>
      </CardContent>
      
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <ProductActions
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          variant="buttons"
          size="small"
        />
      </Box>
    </Card>
  );
};

export default ProductCards;
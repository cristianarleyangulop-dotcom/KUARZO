import AddToCartButton from '@/components/AddToCartButton'
import React from 'react'
import { View } from 'react-native'

const App = () => {
  return (
    <View className='mt-10 mx-5 gap-4'>
      <AddToCartButton variant='yellow' onPress={() => console.log('yellow')} />
      <AddToCartButton variant='orange' onPress={() => console.log('orange')} />
      <AddToCartButton variant='outline' onPress={() => console.log('outline')} />
    </View>
  )
}

export default App

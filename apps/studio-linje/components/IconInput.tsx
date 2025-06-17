import React from 'react'
import {Autocomplete, Card, Flex, Label, Stack, Text} from '@sanity/ui'
import {StringInputProps, set, unset} from 'sanity'
import * as icons from '@entur/icons'

// Inspired by https://www.bekk.christmas/post/2023/11/make-your-own-input-components-in-sanity
export default function IconInput(props: StringInputProps) {
  const {onChange} = props

  const handleChange = (event: {currentTarget: {value: any}}) => {
    const nextValue = event.currentTarget.value
    onChange(nextValue ? set(nextValue) : unset())
  }

  return (
    <Card style={{width: '20rem'}}>
      <Autocomplete
        openButton
        id="iconInput"
        onChange={(value) => handleChange({currentTarget: {value}})}
        options={Object.keys(icons).map((icon) => ({
          title: icon,
          value: icon,
        }))}
        placeholder="Søk etter et ikon"
        renderOption={(option) => (
          <Card as="button">
            <Stack padding={2}>
              <Flex align="center" gap={3}>
                <Text size={4}>
                  {React.createElement(icons[option.title as keyof typeof icons])}
                </Text>
                <Label>{option.title}</Label>
              </Flex>
            </Stack>
          </Card>
        )}
        renderValue={(value, option) => option?.title || value}
        value={props.value}
      />
    </Card>
  )
}

import React, {useEffect, useState} from 'react'
import {useClient} from 'sanity'
import {StringInputProps, set, unset} from 'sanity'

interface Option {
  title: string
  value: string
}

interface DynamicInputProps extends StringInputProps {
  fieldType: 'category' | 'subcategory'
}

export const AutocompletePageFieldInput = (props: DynamicInputProps) => {
  const {fieldType} = props
  const client = useClient({apiVersion: '2025-02-10'})
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const query = `*[_type == "page" && defined(${fieldType})] {
          ${fieldType}
        } | order(${fieldType} asc)`

        const result = await client.fetch(query)
        let optionItems: Option[] = []

        if (result && Array.isArray(result)) {
          const validValues = result
            .map((item: any) => item[fieldType])
            .filter((value: string) => value && typeof value === 'string')
          const uniqueValues = [...new Set(validValues)]
          optionItems = uniqueValues.map((value: string) => ({
            title: value,
            value: value,
          }))
        }

        setOptions(optionItems)
      } catch (error) {
        console.error(`Error fetching ${fieldType}s:`, error)
        setOptions([])
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [client, fieldType])

  useEffect(() => {
    if (props.value && !searchTerm) {
      setSearchTerm(props.value)
    }
  }, [props.value, searchTerm])

  const handleSelect = (option: Option) => {
    props.onChange(set(option.value))
    setSearchTerm(option.title)
    setShowDropdown(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowDropdown(true)

    if (value) {
      props.onChange(set(value))
    } else {
      props.onChange(unset())
    }
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
    if (props.value && !searchTerm) {
      setSearchTerm(props.value)
    }
  }

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200)
  }
  const fieldName = fieldType === 'category' ? 'kategori' : 'underkategori'

  const placeholder = `Søk eller skriv inn en ny ${fieldName} …`

  const noResultsMessage = `Ingen eksisterende ${fieldName}er funnet. "${searchTerm}" blir lagt til som en ny ${fieldName}.`

  const startTypingMessage = `Skriv eller søk for å legge til en ${fieldName}.`

  const availableMessage = `${options.length} ${fieldName}er finnes.`

  const filteredOptions = options.filter((option) =>
    option.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div>Laster {fieldType}er …</div>
  }

  return (
    <div style={{position: 'relative'}}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          boxSizing: 'border-box',
        }}
      />

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                {option.title}
              </div>
            ))
          ) : searchTerm ? (
            <div
              style={{
                padding: '8px 12px',
                color: '#666',
                fontSize: '14px',
                fontStyle: 'italic',
              }}
            >
              {noResultsMessage}
            </div>
          ) : (
            <div
              style={{
                padding: '8px 12px',
                color: '#666',
                fontSize: '14px',
                fontStyle: 'italic',
              }}
            >
              {startTypingMessage}
            </div>
          )}
        </div>
      )}

      <div style={{marginTop: '4px', fontSize: '12px', color: '#666'}}>{availableMessage}</div>
    </div>
  )
}

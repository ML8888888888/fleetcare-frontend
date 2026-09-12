import { CloseOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons'
import { Button, Card, FloatButton, Input, List, Space } from 'antd'
import type { TextAreaRef } from 'antd/es/input/TextArea'
import { useEffect, useRef, useState } from 'react'

type ChatMessage = {
  id: number
  role: 'assistant' | 'user'
  content: string
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hello! I can help you review fleet risk and maintenance priorities.',
  },
]

function FloatingAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const inputRef = useRef<TextAreaRef>(null)

  useEffect(() => {
    if (isChatOpen) {
      inputRef.current?.focus()
    }
  }, [isChatOpen])

  const sendMessage = () => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), role: 'user', content: trimmedMessage },
      {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Thanks. I am checking the latest fleet signals for you.',
      },
    ])
    setMessage('')
  }

  return (
    <>
      {isChatOpen && (
        <Card
          title={
            <Space size="small">
              <RobotOutlined />
              <span>AI Assistant</span>
            </Space>
          }
          extra={
            <Button
              type="text"
              icon={<CloseOutlined />}
              aria-label="Close AI Assistant"
              onClick={() => setIsChatOpen(false)}
            />
          }
          styles={{ body: chatBodyStyle, header: chatHeaderStyle }}
          style={chatWindowStyle}
        >
          <div style={messageListStyle}>
            <List
              dataSource={messages}
              split={false}
              renderItem={(chatMessage) => (
                <List.Item
                  style={{
                    justifyContent: chatMessage.role === 'user' ? 'flex-end' : 'flex-start',
                    padding: '6px 0',
                  }}
                >
                  <div
                    style={{
                      ...messageBubbleStyle,
                      ...(chatMessage.role === 'user' ? userBubbleStyle : assistantBubbleStyle),
                    }}
                  >
                    {chatMessage.content}
                  </div>
                </List.Item>
              )}
            />
          </div>
          <Space.Compact style={{ width: '100%' }}>
            <Input.TextArea
              ref={inputRef}
              value={message}
              autoSize={{ minRows: 1, maxRows: 3 }}
              placeholder="Ask about your fleet..."
              aria-label="Message AI Assistant"
              onChange={(event) => setMessage(event.target.value)}
              onPressEnter={(event) => {
                if (!event.shiftKey) {
                  event.preventDefault()
                  sendMessage()
                }
              }}
            />
            <Button type="primary" icon={<SendOutlined />} aria-label="Send message" onClick={sendMessage} />
          </Space.Compact>
        </Card>
      )}
      <FloatButton
        type="primary"
        icon={isChatOpen ? <CloseOutlined /> : <RobotOutlined />}
        tooltip={isChatOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        aria-label={isChatOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        onClick={() => setIsChatOpen((isOpen) => !isOpen)}
        style={floatButtonStyle}
      />
    </>
  )
}

const chatWindowStyle = {
  position: 'fixed' as const,
  right: 24,
  bottom: 88,
  width: 'min(380px, calc(100vw - 32px))',
  height: 540,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column' as const,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
}
const chatHeaderStyle = { padding: '12px 16px' }
const chatBodyStyle = {
  minHeight: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  padding: 16,
}
const messageListStyle = { flex: 1, minHeight: 0, overflowY: 'auto' as const, marginBottom: 12 }
const messageBubbleStyle = { maxWidth: '82%', padding: '8px 12px', borderRadius: 8, lineHeight: 1.5 }
const assistantBubbleStyle = { background: '#f0f5ff', color: '#1d39c4' }
const userBubbleStyle = { background: '#1677ff', color: '#fff' }
const floatButtonStyle = { right: 24, bottom: 24, zIndex: 1001 }

export default FloatingAssistant
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent, PageAction } from '../../shared/components/layout/page-header/page-header.component';
import { FormsModule } from '@angular/forms';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  userType: 'mentor' | 'mentee';
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  isActive: boolean;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit {
  searchQuery = '';
  selectedConversation: Conversation | null = null;
  newMessage = '';
  isChatOpen = false;
  
  // Header configuration
  headerActions: PageAction[] = [];

  conversations: Conversation[] = [];
  messages: Message[] = [];
  isLoading = false;

  // Current user (should come from a service in real app)
  currentUserId = 'user-1';

  // Mock data
  mockUsers: User[] = [
    {
      id: 'mentor-1',
      firstName: 'Maria',
      lastName: 'Santos',
      userType: 'mentor',
      isOnline: true,
      avatar: undefined
    },
    {
      id: 'mentor-2',
      firstName: 'Jose',
      lastName: 'Rizal',
      userType: 'mentor',
      isOnline: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      id: 'mentor-3',
      firstName: 'Ana',
      lastName: 'De Leon',
      userType: 'mentor',
      isOnline: true,
      avatar: undefined
    },
    {
      id: 'mentor-4',
      firstName: 'Carlos',
      lastName: 'Mendoza',
      userType: 'mentor',
      isOnline: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: 'mentor-5',
      firstName: 'Isabella',
      lastName: 'Garcia',
      userType: 'mentor',
      isOnline: true,
      avatar: undefined
    }
  ];

  mockMessages: Message[] = [
    {
      id: 'msg-1',
      senderId: 'mentor-1',
      receiverId: 'user-1',
      content: 'Hello! Kumusta ka? Ready na ba tayo para sa aming session ngayong linggo?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false,
      type: 'text'
    },
    {
      id: 'msg-2',
      senderId: 'user-1',
      receiverId: 'mentor-1',
      content: 'Hello po! Opo, ready na ako. Anong oras po tayo?',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg-3',
      senderId: 'mentor-1',
      receiverId: 'user-1',
      content: 'Mabuti naman! Around 2PM tayo. May mga materials na din ako na ibibigay sa iyo.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      type: 'text'
    },
    {
      id: 'msg-4',
      senderId: 'mentor-2',
      receiverId: 'user-1',
      content: 'Hi! Natapos mo na ba yung assignment na binigay ko last week?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      type: 'text'
    },
    {
      id: 'msg-5',
      senderId: 'mentor-3',
      receiverId: 'user-1',
      content: 'Good morning! May tanong ako about sa React project mo. Pwede ba tayo mag-chat mamaya?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg-6',
      senderId: 'mentor-4',
      receiverId: 'user-1',
      content: 'Congratulations sa presentation mo kahapon! Napakagaling mo! 🎉',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg-7',
      senderId: 'mentor-5',
      receiverId: 'user-1',
      content: 'Hi! Gusto ko sanang mag-schedule ng career guidance session. Available ka ba this Friday?',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isRead: false,
      type: 'text'
    }
  ];

  ngOnInit() {
    this.loadConversations();
    this.setupHeaderActions();
  }

  setupHeaderActions() {
    this.headerActions = [
      {
        label: 'Bagong Mensahe',
        icon: '➕',
        action: () => this.startNewMessage(),
        class: ''
      }
    ];
  }

  startNewMessage() {
    // Logic to start a new message/conversation
    console.log('Starting new message...');
  }

  loadConversations() {
    // Group messages by mentor and create conversations
    this.conversations = [];
    
    this.mockUsers.forEach(mentor => {
      const mentorMessages = this.mockMessages.filter(
        msg => msg.senderId === mentor.id || msg.receiverId === mentor.id
      );

      if (mentorMessages.length > 0) {
        const lastMessage = mentorMessages.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];

        const unreadCount = mentorMessages.filter(
          msg => msg.senderId === mentor.id && !msg.isRead
        ).length;

        this.conversations.push({
          id: `conv-${mentor.id}`,
          participants: [mentor],
          lastMessage,
          unreadCount,
          isActive: mentor.isOnline
        });
      }
    });

    // Sort conversations by last message timestamp
    this.conversations.sort((a, b) => 
      new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    );
  }

  openChat(conversation: Conversation) {
    this.selectedConversation = conversation;
    this.isChatOpen = true;
    this.loadMessages(conversation);
    
    // Mark messages as read
    this.markMessagesAsRead(conversation);
  }

  closeChat() {
    this.isChatOpen = false;
    this.selectedConversation = null;
    this.messages = [];
    this.newMessage = '';
  }

  loadMessages(conversation: Conversation) {
    const mentorId = conversation.participants[0].id;
    this.messages = this.mockMessages
      .filter(msg => 
        (msg.senderId === mentorId && msg.receiverId === this.currentUserId) ||
        (msg.senderId === this.currentUserId && msg.receiverId === mentorId)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  markMessagesAsRead(conversation: Conversation) {
    const mentorId = conversation.participants[0].id;
    this.mockMessages.forEach(msg => {
      if (msg.senderId === mentorId && msg.receiverId === this.currentUserId) {
        msg.isRead = true;
      }
    });
    
    // Update conversation unread count
    conversation.unreadCount = 0;
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedConversation) {
      const mentorId = this.selectedConversation.participants[0].id;
      
      const message: Message = {
        id: `msg-${Date.now()}`,
        senderId: this.currentUserId,
        receiverId: mentorId,
        content: this.newMessage.trim(),
        timestamp: new Date(),
        isRead: true,
        type: 'text'
      };

      this.messages.push(message);
      this.mockMessages.push(message);
      
      // Update last message in conversation
      this.selectedConversation.lastMessage = message;
      
      // Reorder conversations
      this.loadConversations();
      
      this.newMessage = '';
      
      // Simulate mentor reply after 2 seconds
      setTimeout(() => {
        this.simulateMentorReply(mentorId);
      }, 2000);
    }
  }

  simulateMentorReply(mentorId: string) {
    const replies = [
      'Salamat sa message mo!',
      'Noted. Mag-usap tayo mamaya.',
      'Okay, titingnan ko yan.',
      'Sige, mag-prepare ka na para sa session natin.',
      'Good question! Sagot ko yan later.',
      'Perfect! Keep up the good work!',
      'Understood. Let me help you with that.'
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    const replyMessage: Message = {
      id: `msg-${Date.now()}-reply`,
      senderId: mentorId,
      receiverId: this.currentUserId,
      content: randomReply,
      timestamp: new Date(),
      isRead: false,
      type: 'text'
    };

    this.messages.push(replyMessage);
    this.mockMessages.push(replyMessage);
    
    // Update conversation if it's still open
    if (this.selectedConversation && this.selectedConversation.participants[0].id === mentorId) {
      this.selectedConversation.lastMessage = replyMessage;
      
      // Mark as read if chat is open
      if (this.isChatOpen) {
        replyMessage.isRead = true;
      } else {
        this.selectedConversation.unreadCount++;
      }
    }
    
    this.loadConversations();
  }

  getUserInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getLastSeenText(user: User): string {
    if (user.isOnline) {
      return 'Online ngayon';
    }
    
    if (user.lastSeen) {
      const now = new Date();
      const lastSeen = new Date(user.lastSeen);
      const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 60) {
        return `Last seen ${diffInMinutes} minutes ago`;
      } else if (diffInMinutes < 24 * 60) {
        const hours = Math.floor(diffInMinutes / 60);
        return `Last seen ${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffInMinutes / (24 * 60));
        return `Last seen ${days} day${days > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'Last seen unknown';
  }

  getMessageTime(timestamp: Date): string {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Ngayon lang';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days}d`;
    }
  }

  getDetailedMessageTime(timestamp: Date): string {
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    const isToday = messageDate.toDateString() === now.toDateString();
    const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === messageDate.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (isYesterday) {
      return `Yesterday ${messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
      });
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}

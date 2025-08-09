import { LoginUser } from "./login-user.interface";

export interface Mentor extends LoginUser {
    onlineStatus: boolean;
    profilePicture: string;
    location: string;
    overallRating: number;
    numberOfSessions: number;
    numberOfMentees: number;
    numberOfReviews: number;
    completionRate: number;
    topRated: boolean;
    overview: {
        about: string;
        expertise: string[];
        skills: string[];
        specializations: string[];
        mentorshipStyle: string[];
        languages: string[];
        connect: {
            website: string;
            url: string
        }[];
    },
    experience: {
        education: {
            degree: string;
            institution: string;
            startDate: string;
            endDate: string;
            description: string;
        }[],
        workExperience: {
            jobTitle: string;
            company: string;
            startDate: string;
            endDate: string;
            description: string;
        }[];
        certifications: {
            title: string;
            institution: string;
            issuedDate: string;
            expirationDate: string;
            credentialId: string;
            verificationUrl: string;
        }[];
        achievements: {
            title: string;
            description: string;
            date: string;
        }[];
    },
    portfolio: {
        title: string;
        description: string;
        tags: string[];
        url: string;
        thumbnail: string;
    }[];
    reviews: {
        reviewerName: string;
        rating: number;
        comment: string;
        date: string;
    }[];
    availability: {
        timeZone: string;
        sessionTypes: string[];
        availableTimeSlots: {
            day: string;
            startTime: string;
            endTime: string;
        }[];
    };
}
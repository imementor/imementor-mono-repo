export interface Mentee {
    uid: string;
    firstName: string;
    lastName: string;
    onlineStatus: boolean;
    profilePicture: string;
    location: string;
    overview: {
        about: string;
        languages: string[];
        connect: {
            website: string;
            url: string
        }[];
        interests: string[];
        hobbies: string[];
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
    }
}
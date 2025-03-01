"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import ResumeUpload from "./resume-upload";

interface SkillsExperienceProps {
  data: {
    skills: string[];
  };
  updateData: (data: Partial<{ skills: string[] }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SkillsExperience({ data, updateData, onNext, onBack }: SkillsExperienceProps) {
  const [currentSkill, setCurrentSkill] = useState("");
  
  const handleSkillInput = (value: string) => {
    setCurrentSkill(value);
  };

  const addSkill = () => {
    if (currentSkill && !data.skills.includes(currentSkill.toLowerCase())) {
      updateData({
        skills: [...data.skills, currentSkill],
      });
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillName: string) => {
    updateData({
      skills: data.skills.filter((s) => s !== skillName),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.skills.length > 0) {
      onNext();
    }
  };

  const addSkillsFromResume = (skillsArr: string[]) => {
    const uniqueSkills = skillsArr.filter(
      (skill) => !data.skills.includes(skill.toLowerCase())
    );
    
    updateData({
      skills: [...data.skills, ...uniqueSkills],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Add Your Skills</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Type a skill..."
              value={currentSkill}
              onChange={(e) => handleSkillInput(e.target.value)}
            />
            <Button type="button" onClick={addSkill}>
              Add
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div>Or</div>
          <div>Upload your resume and we'll add your skills</div>
          <ResumeUpload skillsExtracted={addSkillsFromResume} />
        </div>

        <div className="space-y-2">
          <Label>Your Skills</Label>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={data.skills.length === 0}>
          Continue
        </Button>
      </div>
    </form>
  );
}
